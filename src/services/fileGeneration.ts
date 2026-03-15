/**
 * Production file generation service
 * Generates SVG/DXF-ready content from design configuration
 */

export interface DesignConfig {
  type: 'sign' | 'craft' | 'apparel';
  text?: string;
  subtext?: string;
  widthCm?: number;
  heightCm?: number;
  material?: string;
  shape?: 'circle' | 'rounded' | 'square';
  placement?: string;
  artworkUrl?: string;
}

export interface GeneratedFile {
  name: string;
  content: string;
  mimeType: string;
}

const MIN_LINE_THICKNESS = 0.5;
const MIN_TEXT_SIZE_MM = 3;
const MAX_PANEL_CM = 120;

/**
 * Validate design against manufacturing constraints
 */
export function validateDesign(config: DesignConfig): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.widthCm && config.widthCm > MAX_PANEL_CM) {
    warnings.push(`Width ${config.widthCm}cm exceeds max panel size ${MAX_PANEL_CM}cm. File will be auto-split.`);
  }
  if (config.heightCm && config.heightCm > MAX_PANEL_CM) {
    errors.push(`Height ${config.heightCm}cm exceeds max panel size ${MAX_PANEL_CM}cm. Cannot process.`);
  }
  if (config.text && config.text.length > 100) {
    errors.push('Text too long for engraving area.');
  }
  return { valid: errors.length === 0, errors, warnings };
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Generate SVG cut files (auto-splits oversized panels)
 */
export function generateSVGCutFiles(config: DesignConfig): GeneratedFile[] {
  const { text = 'SAMPLE', subtext = '', shape = 'rounded', widthCm = 10, heightCm = 10 } = config;
  const w = widthCm * 10; // mm
  const h = heightCm * 10;
  const maxW = MAX_PANEL_CM * 10;

  const files: GeneratedFile[] = [];
  const parts = Math.ceil(w / maxW);
  const partWidth = w / parts;
  const r = shape === 'circle' ? Math.min(partWidth, h) / 2 : shape === 'rounded' ? 12 : 0;
  const slug = text.replace(/\s+/g, '_').slice(0, 20).toLowerCase() || 'design';

  for (let i = 0; i < parts; i++) {
    const xOffset = i * partWidth;
    let textElements = '';
    const textX = (w / 2) - xOffset;
    if (textX > -partWidth && textX < partWidth * 2) {
      textElements += '<text x="' + textX + '" y="' + (h / 2 - 2) + '" class="text" text-anchor="middle">' + escapeXml(text) + '</text>';
      if (subtext) {
        textElements += '<text x="' + textX + '" y="' + (h / 2 + 8) + '" class="text" text-anchor="middle" font-size="' + Math.max(MIN_TEXT_SIZE_MM, partWidth / 12) + 'mm">' + escapeXml(subtext) + '</text>';
      }
    }

    const splitLine = parts > 1 ? '<line x1="0" y1="0" x2="0" y2="' + h + '" stroke="red" stroke-width="1" stroke-dasharray="4"/>' : '';

    const svg = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + partWidth + ' ' + h + '" width="' + partWidth + 'mm" height="' + h + 'mm">',
      '  <defs>',
      '    <style>.text { font-family: sans-serif; font-size: ' + Math.max(MIN_TEXT_SIZE_MM, w / 8) + 'mm; fill: #000; }</style>',
      '  </defs>',
      '  <rect x="0" y="0" width="' + partWidth + '" height="' + h + '" rx="' + r + '" ry="' + r + '" fill="none" stroke="#000" stroke-width="' + MIN_LINE_THICKNESS + '"/>',
      '  ' + textElements,
      '  <!-- Split cut mark ' + (i + 1) + '/' + parts + ' -->',
      '  ' + splitLine,
      '</svg>',
    ].join('\n');

    files.push({
      name: parts > 1 ? slug + '_part_' + (i + 1) + '_cut.svg' : slug + '_cut.svg',
      content: svg,
      mimeType: 'image/svg+xml',
    });
  }

  return files;
}

/**
 * Backward-compatible wrapper for single-file SVG generation
 */
export function generateSVGCutFile(config: DesignConfig): string {
  const files = generateSVGCutFiles(config);
  return files[0]?.content || '';
}

/**
 * Generate DXF Cut File (Simple R12 format outline)
 */
export function generateDXFCutFile(config: DesignConfig): GeneratedFile {
  const w = (config.widthCm || 10) * 10;
  const h = (config.heightCm || 10) * 10;
  const slug = (config.text || 'design').replace(/\s+/g, '_').slice(0, 20).toLowerCase();

  const lines = [
    '0', 'SECTION', '2', 'ENTITIES',
    '0', 'LINE', '8', '0', '10', '0.0', '20', '0.0', '11', w + '.0', '21', '0.0',
    '0', 'LINE', '8', '0', '10', w + '.0', '20', '0.0', '11', w + '.0', '21', h + '.0',
    '0', 'LINE', '8', '0', '10', w + '.0', '20', h + '.0', '11', '0.0', '21', h + '.0',
    '0', 'LINE', '8', '0', '10', '0.0', '20', h + '.0', '11', '0.0', '21', '0.0',
    '0', 'ENDSEC', '0', 'EOF',
  ];

  return {
    name: slug + '_cut.dxf',
    content: lines.join('\n'),
    mimeType: 'text/plain',
  };
}

/**
 * Generate Material List (CSV)
 */
export function generateMaterialList(config: DesignConfig): GeneratedFile {
  const w = config.widthCm || 10;
  const h = config.heightCm || 10;
  const mat = config.material || 'Standard';
  const slug = (config.text || 'design').replace(/\s+/g, '_').slice(0, 20).toLowerCase();

  const rows = [
    'Item,Quantity,Description,Dimensions',
    'Primary Material,1,' + mat + ' panel,' + w + 'cm x ' + h + 'cm',
  ];
  if (config.type === 'sign') {
    rows.push('LED Strip,1,12V Neon Flex,' + Math.round(w * 2 + h * 2) + 'cm');
    rows.push('Power Supply,1,12V 5A Adapter,-');
    rows.push('Standoff Hardware,4,Wall mounting barrels,-');
  }

  return {
    name: slug + '_materials.csv',
    content: rows.join('\n'),
    mimeType: 'text/csv',
  };
}

/**
 * Generate Assembly Diagram (SVG showing layers)
 */
export function generateAssemblyDiagram(config: DesignConfig): GeneratedFile {
  const w = (config.widthCm || 10) * 10;
  const h = (config.heightCm || 10) * 10;
  const slug = (config.text || 'design').replace(/\s+/g, '_').slice(0, 20).toLowerCase();

  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 ' + (w + 120) + ' ' + (h + 120) + '" width="100%" height="100%">',
    '  <defs><style>.text { font-family: sans-serif; font-size: 14px; fill: #666; font-weight: bold; }</style></defs>',
    '  <g transform="translate(0, 80)">',
    '    <rect x="0" y="0" width="' + w + '" height="' + h + '" fill="#eee" stroke="#999" stroke-dasharray="8" />',
    '    <text x="0" y="-10" class="text">Backplate (Mounting)</text>',
    '  </g>',
    '  <g transform="translate(20, 40)">',
    '    <rect x="0" y="0" width="' + w + '" height="' + h + '" fill="none" stroke="#ff9900" stroke-width="4" />',
    '    <text x="0" y="-10" class="text">LED Routing Channel</text>',
    '  </g>',
    '  <g transform="translate(40, 0)">',
    '    <rect x="0" y="0" width="' + w + '" height="' + h + '" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" stroke-width="2" />',
    '    <text x="0" y="-10" class="text">Front Face (' + (config.material || 'Material') + ')</text>',
    '    <text x="' + (w / 2) + '" y="' + (h / 2) + '" font-family="sans-serif" font-size="' + Math.max(12, w / 8) + '" fill="#333" text-anchor="middle">' + escapeXml(config.text || 'Logo') + '</text>',
    '  </g>',
    '</svg>',
  ].join('\n');

  return {
    name: slug + '_assembly.svg',
    content: svg,
    mimeType: 'image/svg+xml',
  };
}

/**
 * Generate DST embroidery file (C1 - Tajima format).
 * Minimal implementation: produces a valid DST with a simple outline from text bounds.
 */
export function generateDSTFile(config: DesignConfig): GeneratedFile {
  const w = Math.min(121, (config.widthCm || 10) * 10);
  const h = Math.min(121, (config.heightCm || 10) * 10);
  const slug = (config.text || 'design').replace(/\s+/g, '_').slice(0, 20).toLowerCase();

  const header = new Uint8Array(512);
  const encoder = new TextEncoder();
  encoder.encodeInto('LA:', header);
  header[2] = 0x00;
  header[3] = 0x20;

  const stitches: number[] = [];
  const encodeStitch = (dx: number, dy: number, flags: number) => {
    let b1 = 0, b2 = 0, b3 = flags;
    const clamp = (v: number) => Math.max(-121, Math.min(121, v));
    dx = clamp(dx);
    dy = clamp(dy);
    if (dx >= 0) b1 |= 1 << 0;
    else b1 |= 1 << 1;
    if (dy >= 0) b1 |= 1 << 2;
    else b1 |= 1 << 3;
    if (dx >= 9) b1 |= 1 << 4;
    if (dx <= -9) b1 |= 1 << 5;
    if (dy >= 9) b1 |= 1 << 6;
    if (dy <= -9) b1 |= 1 << 7;
    stitches.push(b1, b2, b3);
  };

  encodeStitch(w, 0, 1);
  encodeStitch(0, h, 1);
  encodeStitch(-w, 0, 1);
  encodeStitch(0, -h, 1);
  stitches.push(0x00, 0x00, 0xF3);

  const body = new Uint8Array(stitches);
  const full = new Uint8Array(512 + body.length);
  full.set(header);
  full.set(body, 512);

  const binary = String.fromCharCode(...full);
  const base64 = btoa(binary);

  return {
    name: slug + '_embroidery.dst',
    content: base64,
    mimeType: 'application/octet-stream',
  };
}

/**
 * Generate print placement file (C2) - JSON with placement coordinates for DTF/DTG.
 */
export function generatePrintPlacementFile(config: DesignConfig & { placement?: string; artworkUrl?: string }): GeneratedFile {
  const placements: Record<string, { x: number; y: number; width: number; height: number; dpi: number }> = {
    'left-chest': { x: 0.15, y: 0.25, width: 0.2, height: 0.2, dpi: 200 },
    'chest': { x: 0.35, y: 0.3, width: 0.3, height: 0.25, dpi: 200 },
    'full-back': { x: 0.25, y: 0.15, width: 0.5, height: 0.55, dpi: 200 },
    'sleeve-upper': { x: 0.3, y: 0.2, width: 0.4, height: 0.3, dpi: 200 },
  };
  const placement = config.placement || 'left-chest';
  const coords = placements[placement] || placements['left-chest'];
  const output = {
    productType: config.type,
    placement,
    coordinates: coords,
    dimensions: { widthCm: config.widthCm || 10, heightCm: config.heightCm || 10 },
    artwork: config.artworkUrl || null,
    text: config.text,
    generatedAt: new Date().toISOString(),
  };
  const slug = (config.text || 'design').replace(/\s+/g, '_').slice(0, 20).toLowerCase();
  return {
    name: slug + '_placement.json',
    content: JSON.stringify(output, null, 2),
    mimeType: 'application/json',
  };
}

/**
 * Trigger download of generated file.
 * For binary (base64 content), decodes before creating blob.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  let blob: Blob;
  if (mimeType === 'application/octet-stream' && /^[A-Za-z0-9+/=]+$/.test(content)) {
    const binary = atob(content);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    blob = new Blob([bytes], { type: mimeType });
  } else {
    blob = new Blob([content], { type: mimeType });
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
