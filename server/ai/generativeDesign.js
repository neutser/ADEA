/**
 * Generative Design — AI image generation from text prompts.
 * Uses DALL-E 3 for design concept generation.
 */

import { sanitizeUserMessage } from './aiUtils.js';

// Server-side only — never use VITE_* (client-exposed)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MAX_PROMPT_LEN = 1000;

/**
 * @param {object} params
 * @param {string} params.prompt - User text prompt
 * @param {string} [params.productCategory] - e.g. signs, apparel, crafts
 * @param {string} [params.style] - e.g. modern, luxury, minimal
 * @returns {Promise<{ images: Array<{ url?: string, b64?: string }> } | null>} - Images or null when no API key
 */
export async function generateDesign({ prompt, productCategory, style }) {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const sanitizedPrompt = sanitizeUserMessage(prompt || '').slice(0, MAX_PROMPT_LEN);
  if (!sanitizedPrompt) return null;

  const categoryMap = {
    signs: 'logo or sign artwork, suitable for 3D layered acrylic or LED backlit sign',
    apparel: 'print or embroidery design for garment placement (chest, back, sleeve)',
    crafts: 'engraving or laser-cut design for keychain, plaque, or accessory',
    gifts: 'gift or keepsake artwork for mug wrap, plaque, or keepsake box',
    wedding: 'elegant wedding invitation or signage artwork',
    default: 'custom product artwork suitable for manufacturing',
  };
  const cat = String(productCategory || '').toLowerCase();
  const categoryHint = categoryMap[cat] || categoryMap.default;
  const styleHints = {
    modern: 'Modern, clean, geometric. Sans-serif feel.',
    luxury: 'Luxury, premium. Gold accents, elegant typography.',
    minimal: 'Minimal, sparse. Single focal point, ample whitespace.',
    vintage: 'Vintage, retro. Classic typography, muted palette.',
  };
  const styleHint = style ? (styleHints[String(style).toLowerCase()] || `Style: ${style}.`) : '';
  const enhancedPrompt = [
    `Professional design concept for ${categoryHint}: ${sanitizedPrompt}`,
    styleHint,
    'Clean lines, vector-friendly, suitable for laser cutting, printing, or engraving. No fine text under 3mm; bold shapes and readable elements. High contrast, professional aesthetic. Output suitable for direct use in product zone.',
  ].filter(Boolean).join(' ');

  const numImages = 2;
  const images = [];

  for (let i = 0; i < numImages; i++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'b64_json',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
      }

      const data = await res.json();
      const img = data.data?.[0];
      if (img?.b64_json) {
        images.push({ b64: img.b64_json });
      }
    } catch (e) {
      console.warn('Generative design image error:', e.message);
      if (images.length === 0) throw e;
      break;
    }
  }

  return images.length > 0 ? { images } : null;
}
