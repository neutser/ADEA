/**
 * Generative Design — AI image generation from text prompts.
 * Uses DALL-E 3 for design concept generation.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

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

  const categoryMap = { signs: 'logo or sign artwork', apparel: 'print or embroidery design', crafts: 'engraving or laser-cut design', gift: 'gift or keepsake artwork' };
  const categoryHint = (productCategory && categoryMap[String(productCategory).toLowerCase()]) || 'custom product artwork';
  const enhancedPrompt = [
    `Professional design concept for ${categoryHint}: ${prompt}`,
    style ? `Style: ${style}.` : '',
    'Clean lines, vector-friendly, suitable for laser cutting, printing, or engraving. No fine text; bold shapes and readable elements. High contrast, professional aesthetic.',
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
