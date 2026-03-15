/**
 * AI chat sidebar for Crafting Studio — machine-aware design assistant.
 */

import { useState, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { useStudioStore } from '@/stores/studioStore';
import { API_BASE } from '@/config';

const API = API_BASE;

export function AIChatSidebar() {
  const { machineId, material, selectedTool, layers } = useStudioStore();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);

  const handleSend = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/machine-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          machineId,
          material: material?.name,
          selectedTool,
          layerCount: layers.length,
          conversationHistory: messages.slice(-6),
        }),
      });
      const data = await res.json();
      if (res.status === 503 && data.code === 'AI_UNAVAILABLE') {
        setFallback(true);
        setMessages((prev) => prev.slice(0, -1));
      } else if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Sorry, I could not respond.' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, machineId, material, selectedTool, layers.length, messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-neon-purple)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MessageSquare size={14} /> AI Assistant
      </h3>
      {fallback ? (
        <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p>Set OPENAI_API_KEY on the server to enable AI. Tips:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Curio 2: Use emboss for leather, cut for cardstock.</li>
            <li>xTool: 3mm acrylic cuts at ~15mm/s, engraves at 3000mm/min.</li>
            <li>Ensure design fits bed: Curio 203×305mm, xTool 406×432mm.</li>
          </ul>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
            {messages.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Ask: &quot;Will this cut work on 3mm acrylic?&quot; or &quot;Optimize for xTool speed.&quot;
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: m.role === 'user' ? 'rgba(0,240,255,0.08)' : 'rgba(176, 38, 255, 0.08)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(0,240,255,0.2)' : 'rgba(176, 38, 255, 0.2)'}`,
                  fontSize: '0.85rem',
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thinking...</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Curio or xTool..."
              disabled={loading}
              style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem' }}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={loading || !input.trim()} style={{ padding: '10px 16px' }}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
