/**
 * AI Scene Analysis — backend orchestration for scene understanding.
 * Calls OpenAI Vision when API key is set; returns structured recommendations.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

export async function analyzeScene(imageDataUrl) {
  if (!imageDataUrl?.startsWith('data:')) {
    return getFallbackResult();
  }

  if (OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this room/storefront/office image. Reply with JSON only: {"surfaces":[{"type":"wall","bounds":[x1,y1,x2,y2],"confidence":0.9}],"products":["3d-logo","led-acrylic","office-sign"],"scale":0.4,"perspective":"flat|angled|outdoor"}. Identify walls, flat surfaces, and recommend sign placement. Keep bounds as 0-1 normalized.',
                },
                {
                  type: 'image_url',
                  image_url: { url: imageDataUrl },
                },
              ],
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('OpenAI API error');
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          detectedSurfaces: (parsed.surfaces || []).map((s) => ({
            type: s.type,
            bounds: s.bounds?.slice(0, 4) || [0.1, 0.2, 0.9, 0.8],
            confidence: s.confidence ?? 0.8,
          })),
          recommendedProductTypes: parsed.products || ['3d-logo', 'led-acrylic', 'office-sign'],
          suggestedScale: parsed.scale ?? 0.4,
          perspective: parsed.perspective || 'flat',
        };
      }
    } catch (e) {
      console.warn('AI scene analysis failed, using fallback:', e.message);
    }
  }

  await new Promise((r) => setTimeout(r, 400));
  return getFallbackResult();
}

function getFallbackResult() {
  return {
    detectedSurfaces: [{ type: 'wall', bounds: [0.1, 0.2, 0.9, 0.8], confidence: 0.7 }],
    recommendedProductTypes: ['3d-logo', 'led-acrylic', 'office-sign'],
    suggestedScale: 0.4,
    perspective: 'flat',
  };
}
