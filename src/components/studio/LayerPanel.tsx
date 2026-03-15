/**
 * Layer panel — Cut, Engrave, Emboss layers with visibility/lock.
 */

import { useStudioStore } from '@/stores/studioStore';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';

export function LayerPanel() {
  const { layers, updateLayer, removeLayer } = useStudioStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-neon-blue)', textTransform: 'uppercase', letterSpacing: 1 }}>
        Layers
      </h3>
      {layers.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No layers. Import SVG or add design.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[...layers].sort((a, b) => a.order - b.order).map((layer) => (
            <div
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                background: 'var(--bg-elevated)',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ flex: 1, fontSize: '0.85rem' }}>{layer.name || layer.type}</span>
              <button
                onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                title={layer.visible ? 'Hide' : 'Show'}
              >
                {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => updateLayer(layer.id, { locked: !layer.locked })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                title={layer.locked ? 'Unlock' : 'Lock'}
              >
                {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              <button
                onClick={() => removeLayer(layer.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
