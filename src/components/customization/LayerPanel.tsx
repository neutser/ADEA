/**
 * LayerPanel — Reorder, lock, duplicate, visibility for design layers.
 */

import { useDesignStore } from '@/stores/designStore';
import { Layers, Lock, Unlock, Copy, Eye, EyeOff, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export function LayerPanel() {
  const {
    layers,
    selectedLayerId,
    setSelectedLayer,
    removeLayer,
    duplicateLayer,
    updateLayer,
    reorderLayer,
  } = useDesignStore();

  if (layers.length === 0) {
    return (
      <div className="layer-panel glass-panel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--text-muted)' }}>
          <Layers size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Layers</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add text, images, or shapes to create layers.</p>
      </div>
    );
  }

  return (
    <div className="layer-panel glass-panel" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--text-muted)' }}>
        <Layers size={18} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Layers</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[...layers].reverse().map((layer, revIdx) => {
          const idx = layers.length - 1 - revIdx;
          const isSelected = selectedLayerId === layer.id;
          const typeLabel = layer.type === 'text' ? 'T' : layer.type === 'image' ? 'Img' : 'Shape';
          return (
            <div
              key={layer.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedLayer(layer.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedLayer(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 8,
                background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: `1px solid ${isSelected ? 'var(--accent-neon-blue)' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                {typeLabel}
              </span>
              <span style={{ flex: 1, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {layer.name || `${layer.type} ${idx + 1}`}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <button
                  type="button"
                  aria-label={layer.visible ? 'Hide' : 'Show'}
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: layer.visible ? 'inherit' : 'var(--text-muted)' }}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  aria-label={layer.locked ? 'Unlock' : 'Lock'}
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: layer.locked ? 'var(--accent-neon-blue)' : 'inherit' }}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                <button
                  type="button"
                  aria-label="Duplicate"
                  onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Copy size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, idx - 1); }}
                  disabled={idx === 0}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, idx + 1); }}
                  disabled={idx === layers.length - 1}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: idx === layers.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === layers.length - 1 ? 0.4 : 1 }}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                  style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
