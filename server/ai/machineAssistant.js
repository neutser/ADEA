/**
 * Machine-aware AI assistant for Crafting Studio.
 * Curio 2 and xTool specific advice.
 */

import { sanitizeUserMessage, sanitizeAssistantOutput, INSTRUCTION_BOUNDARY } from './aiUtils.js';

// Server-side only — never use VITE_* (client-exposed)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function machineAssistant({ message, machineId, material, selectedTool, layerCount, conversationHistory = [] }) {
  if (!OPENAI_API_KEY) return null;

  const sanitizedMessage = sanitizeUserMessage(message);
  if (!sanitizedMessage) return { reply: 'Please ask a question about your machine or materials.' };

  const systemPrompt = `You are the AI assistant for a crafting studio supporting Silhouette Curio 2 and xTool laser machines.

Machines:
- Curio 2: Bed 203×305mm. Emboss, cut, score. Dual carriage. Materials: paper, cardstock, leather up to 3mm.
- xTool D1/M1: Bed 406×432mm. Laser cut, engrave. Materials: wood, acrylic, leather, metal (M1).

When asked "will this cut work on 3mm acrylic?", validate bed size, material thickness, and machine capabilities.
When asked "optimize for xTool speed", suggest power/speed settings (e.g., 3mm acrylic: 15mm/s cut, 3000mm/min engrave).
Be concise (2-4 sentences). Current: machine=${machineId}, material=${material || 'none'}, tool=${selectedTool}, layers=${layerCount}.
${INSTRUCTION_BOUNDARY}`;

  const safeHistory = conversationHistory.slice(-8).map((m) => ({
    role: m.role,
    content: typeof m.content === 'string' ? sanitizeUserMessage(m.content) : '',
  })).filter((m) => m.content);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...safeHistory,
    { role: 'user', content: sanitizedMessage },
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
    return { reply };
  } catch (e) {
    console.warn('Machine assistant error:', e.message);
    throw e;
  }
}
