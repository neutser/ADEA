/**
 * AI Design Assistant — LLM-backed chat for design help.
 * Helps with material choices, sizing, placement, and design tips.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

/**
 * @param {object} params
 * @param {string} params.message - User message
 * @param {string} params.productId - Product ID
 * @param {string} params.productName - Product display name
 * @param {object} params.config - Current design config
 * @param {Array<{ role: string, content: string }>} params.conversationHistory - Last N messages for context
 * @returns {Promise<{ reply: string } | null>} - Reply or null when no API key
 */
export async function designAssistant({ message, productId, productName, config, conversationHistory = [] }) {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const configStr = JSON.stringify(config || {}).slice(0, 600);
  const systemPrompt = `You are the AI Studio Assistant for Adea Crafts, a premium custom manufacturing platform. Guide users through creating production-ready designs.

RULES:
- Be product-aware: only recommend options that exist in the product schema. Never suggest features the product does not support.
- Reference the current config when giving advice. Be concise (2-4 sentences) unless the user asks for detail.
- Consider 3D and 2D preview: signs/plaques/keychains use 3D; flat products use 2D overlay. Advise on placement, size, and readability accordingly.
- Respect manufacturing constraints: min text/stroke, max panel size, panel splitting for large signs. Warn when designs may need custom quotes.
- Offer actionable suggestions with reasoning when asked "why."

Product: ${productName || productId || 'custom'}
Current config: ${configStr}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages,
      }),
    });

    if (!res.ok) throw new Error('OpenAI API error');
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'I couldn\'t generate a response. Please try again.';
    return { reply };
  } catch (e) {
    console.warn('Design assistant error:', e.message);
    throw e;
  }
}
