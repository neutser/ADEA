/**
 * AI Design Assistant — LLM-backed chat for design help.
 * Structured design generation, manufacturability guidance, product constraint validation.
 */

import { sanitizeUserMessage, sanitizeAssistantOutput, INSTRUCTION_BOUNDARY } from './aiUtils.js';

// Server-side only — never use VITE_* (client-exposed)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const CATEGORY_PROMPTS = {
  signs: `SIGNS: 3D logo signs, LED backlighting, acrylic/wood/metal. Constraints: min line 0.5mm, min text 3mm, max panel 120cm (auto-split). Advise on material choice for indoor/outdoor, LED vs matte, mounting options.`,
  apparel: `APPAREL: DTF print, embroidery, screen print. Zones: chest, back, sleeve. Constraints: min 200 DPI for print. Advise on placement (left chest vs full back), embroidery vs DTF for logo detail.`,
  crafts: `CRAFTS: Keychains, plaques, engraved items. Materials: wood, acrylic, leather, metal. Advise on shape, engraving depth, hardware options.`,
  gifts: `GIFTS: Mugs, plaques, keepsakes. Wrap areas, sublimation, engraving. Advise on inside/handle colors, paper stocks, foil options.`,
  wedding: `WEDDING: Invitations, place cards, signage. Paper stocks, foil stamping, envelope options. Advise on bulk pricing, foil vs matte.`,
  default: `CUSTOM: General product customization. Advise on materials, placement, and manufacturability.`,
};

/**
 * @param {object} params
 * @param {string} params.message - User message
 * @param {string} params.productId - Product ID
 * @param {string} params.productName - Product display name
 * @param {string} [params.productCategory] - signs, apparel, crafts, gifts, wedding
 * @param {object} params.config - Current design config
 * @param {object} [params.schema] - Customization schema (fields, surfaces, production)
 * @param {Array<{ role: string, content: string }>} params.conversationHistory - Last N messages for context
 * @returns {Promise<{ reply: string, suggestions?: string[] } | null>} - Reply or null when no API key
 */
export async function designAssistant({ message, productId, productName, productCategory, config, schema, conversationHistory = [] }) {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const sanitizedMessage = sanitizeUserMessage(message);
  if (!sanitizedMessage) return { reply: 'Please provide a design question.', suggestions: undefined };

  const configStr = JSON.stringify(config || {}).slice(0, 600);
  const categoryHint = CATEGORY_PROMPTS[String(productCategory || '').toLowerCase()] || CATEGORY_PROMPTS.default;
  const fieldNames = schema?.fields?.map((f) => f.id).join(', ') || 'general';
  const productionNote = schema?.production
    ? `Production: minLineMM=${schema.production.minLineMM ?? 'n/a'}, minTextMM=${schema.production.minTextMM ?? 'n/a'}, maxPanelCM=${schema.production.maxPanelCM ?? 'n/a'}, minDPI=${schema.production.minDPI ?? 'n/a'}`
    : '';

  const systemPrompt = `You are the AI Studio Assistant for Adea Crafts, a premium custom manufacturing platform. Provide STRUCTURED, ACTIONABLE design guidance.

PRODUCT CONTEXT:
${categoryHint}

CONFIGURABLE FIELDS: ${fieldNames}
${productionNote}

RULES:
1. Only recommend options that exist in the schema. Never suggest unsupported features.
2. When user asks for "suggestions" or "improvements", respond with 2-4 bullet points. Each point: [Action] — [Reason].
3. Validate manufacturability: warn if text too small, artwork low-res, or dimensions exceed limits.
4. For style variants: suggest concrete config changes (e.g. "Try material: acrylic_black with led: cool").
5. Be concise (2-4 sentences) unless user asks for detail. End actionable items with clear next steps.

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
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    const reply = sanitizeAssistantOutput(raw);
    const suggestions = reply.match(/^[-•]\s+.+$/gm)?.map((s) => s.replace(/^[-•]\s+/, '').trim()) || null;
    return { reply, suggestions: suggestions || undefined };
  } catch (e) {
    console.warn('Design assistant error:', e.message);
    throw e;
  }
}
