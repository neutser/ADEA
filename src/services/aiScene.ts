/**
 * AI Scene Analysis Service
 * Integrates with OpenAI Vision / Gemini Vision for scene understanding
 * Fallback: rule-based placement when API unavailable
 */

export interface SceneAnalysisResult {
  detectedSurfaces: { type: string; bounds: [number, number, number, number]; confidence: number }[];
  recommendedProductTypes: string[];
  suggestedScale?: number;
  perspective?: 'flat' | 'angled' | 'outdoor';
}

/** Canonical backend product IDs (unified with marketplace) */
export const FALLBACK_RECOMMENDATIONS: { product: string; productId: string; reason: string; defaultConfig?: Record<string, unknown> }[] = [
  { product: 'Custom Sign', productId: 'craft-sign', reason: 'Suitable for interior branding' },
  { product: 'Door Sign', productId: 'craft-door', reason: 'Professional door or entry signage' },
  { product: 'Welcome Sign', productId: 'craft-welcome', reason: 'Welcome signage for events or offices' },
];

import { API_BASE } from '@/config';

/**
 * Analyze uploaded scene image via backend AI API (preferred) or direct OpenAI when API unavailable.
 * Falls back to rule-based mock when both unavailable.
 */
export async function analyzeScene(imageDataUrl: string): Promise<SceneAnalysisResult> {
  if (!imageDataUrl?.startsWith('data:')) {
    return getFallbackSceneResult();
  }

  try {
    const res = await fetch(`${API_BASE}/api/ai/analyze-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        detectedSurfaces: (data.detectedSurfaces || []).map((s: { type: string; bounds: number[]; confidence?: number }) => ({
          type: s.type,
          bounds: s.bounds?.slice(0, 4) as [number, number, number, number],
          confidence: s.confidence ?? 0.8,
        })),
        recommendedProductTypes: data.recommendedProductTypes || ['3d-logo', 'led-acrylic', 'office-sign'],
        suggestedScale: data.suggestedScale ?? 0.4,
        perspective: (data.perspective as 'flat' | 'angled' | 'outdoor') || 'flat',
      };
    }
  } catch (e) {
    console.warn('Backend AI scene analysis failed, using fallback:', e);
  }

  return getFallbackSceneResult();
}

function getFallbackSceneResult(): SceneAnalysisResult {
  return {
    detectedSurfaces: [{ type: 'wall', bounds: [0.1, 0.2, 0.9, 0.8], confidence: 0.7 }],
    recommendedProductTypes: ['3d-logo', 'led-acrylic', 'office-sign'],
    suggestedScale: 0.4,
    perspective: 'flat',
  };
}

/** Map AI product type IDs to display names */
const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  '3d-logo': '3D Company Logo Sign',
  'led-acrylic': 'LED Acrylic Sign',
  'office-sign': 'Acrylic Door Plaque',
};

/** Map AI product display names to canonical backend product IDs */
export const AI_PRODUCT_TO_CONFIGURATOR_ID: Record<string, string> = {
  '3D Company Logo Sign': 'sign-3d-logo',
  'LED Acrylic Sign': 'sign-3d-logo',
  'Acrylic Door Plaque': 'sign-3d-logo',
};

/**
 * Get product recommendations from analysis (or fallback)
 */
export function getRecommendationsFromAnalysis(result: SceneAnalysisResult): { product: string; productId: string; reason: string; defaultConfig?: Record<string, unknown> }[] {
  const types = result.recommendedProductTypes.slice(0, 3);
  if (types.length === 0) return FALLBACK_RECOMMENDATIONS;
  return types.map((id) => {
    const product = PRODUCT_DISPLAY_NAMES[id] ?? id;
    const productId = AI_PRODUCT_TO_CONFIGURATOR_ID[product] ?? 'craft-sign';
    const fallback = FALLBACK_RECOMMENDATIONS.find(r => r.product === product);
    return {
      product,
      productId,
      reason: `Detected ${result.perspective ?? 'flat'} surface – suitable placement`,
      defaultConfig: fallback?.defaultConfig,
    };
  });
}
