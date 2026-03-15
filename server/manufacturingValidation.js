/**
 * Manufacturing Validation Engine
 * Validates designs against machine bed size, min stroke, panel split logic.
 */

const DEFAULT_BED_MM = [1200, 900];
const DEFAULT_MAX_PANEL_CM = 120;

/**
 * @param {string} productId - Product ID (e.g. sign-3d-logo)
 * @param {object} config - User configuration (width, height, text, etc.)
 * @param {object} productionProfile - From schema.production or product production_profile_json
 * @returns {{ valid: boolean, errors: string[], warnings: string[], splitRequired?: boolean, suggestedPanels?: Array<{ width: number, height: number }> }}
 */
export function validateForProduction(productId, config, productionProfile = {}) {
  const errors = [];
  const warnings = [];
  const profile = productionProfile || {};
  const bedMM = profile.bedSizeMM || DEFAULT_BED_MM;
  const maxPanelCM = profile.maxPanelCM ?? DEFAULT_MAX_PANEL_CM;
  const minTextMM = profile.minTextMM ?? 2;
  const minLineMM = profile.minLineMM ?? 0.5;
  const autoSplit = profile.autoSplit ?? true;

  const widthCm = config?.width ?? config?.widthCm ?? 60;
  const heightCm = config?.heightCm ?? widthCm * 0.5;
  const widthMM = widthCm * 10;
  const heightMM = heightCm * 10;

  // Bed size check
  if (widthMM > bedMM[0] || heightMM > bedMM[1]) {
    errors.push(`Design dimensions ${widthCm}x${heightCm}cm exceed machine bed ${bedMM[0]/10}x${bedMM[1]/10}cm.`);
  }

  // Max panel check
  if (widthCm > maxPanelCM) {
    if (autoSplit) {
      warnings.push(`Width ${widthCm}cm exceeds max panel ${maxPanelCM}cm — will be auto-split into panels.`);
    } else {
      errors.push(`Width ${widthCm}cm exceeds max panel size ${maxPanelCM}cm.`);
    }
  }

  // Min text/stroke (heuristic: if text exists, we assume it meets min when length is reasonable)
  if (config?.text && minTextMM > 0) {
    const textLen = String(config.text).length;
    if (textLen > 50 && widthCm < 40) {
      warnings.push(`Long text (${textLen} chars) on small sign — ensure minimum ${minTextMM}mm stroke for legibility.`);
    }
  }

  const splitRequired = autoSplit && widthCm > maxPanelCM;
  let suggestedPanels = null;
  if (splitRequired) {
    const numPanels = Math.ceil(widthCm / maxPanelCM);
    suggestedPanels = Array.from({ length: numPanels }, (_, i) => ({
      width: i < numPanels - 1 ? maxPanelCM : (widthCm - (numPanels - 1) * maxPanelCM),
      height: heightCm,
    }));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    splitRequired: !!splitRequired,
    suggestedPanels,
  };
}

/**
 * Split a sign config into multiple panel configs for generation.
 * @param {object} config - Original config
 * @param {number} maxPanelCM - Max width per panel
 * @returns {object[]} Array of configs, one per panel
 */
export function splitConfigIntoPanels(config, maxPanelCM = DEFAULT_MAX_PANEL_CM) {
  const widthCm = config?.width ?? config?.widthCm ?? 60;
  const heightCm = config?.heightCm ?? widthCm * 0.5;

  if (widthCm <= maxPanelCM) {
    return [config];
  }

  const numPanels = Math.ceil(widthCm / maxPanelCM);
  const panels = [];
  const text = config?.text || config?.title || 'SAMPLE';
  const subtext = config?.subtext || config?.date || '';
  const words = text.split(/\s+/);
  const wordsPerPanel = Math.ceil(words.length / numPanels);

  for (let i = 0; i < numPanels; i++) {
    const panelWidth = i < numPanels - 1 ? maxPanelCM : (widthCm - (numPanels - 1) * maxPanelCM);
    const panelText = words.slice(i * wordsPerPanel, (i + 1) * wordsPerPanel).join(' ') || (i === 0 ? text : '');
    panels.push({
      ...config,
      width: panelWidth,
      widthCm: panelWidth,
      heightCm,
      text: panelText,
      subtext: i === 0 ? subtext : '',
      _panelIndex: i,
      _totalPanels: numPanels,
    });
  }
  return panels;
}
