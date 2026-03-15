/**
 * EffectToolbar — Per-layer craft effect assignment (engrave, emboss, deboss).
 */

import { useDesignStore } from '@/stores/designStore';
import type { CraftEffect } from '@/types/designEditor';
import { Sparkles } from 'lucide-react';

const EFFECTS: { id: CraftEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'engrave', label: 'Engrave' },
  { id: 'emboss', label: 'Emboss' },
  { id: 'deboss', label: 'Deboss' },
];

export interface EffectToolbarProps {
  canvasRef: React.RefObject<{ restoreFromStore: () => Promise<void> } | null>;
}

export function EffectToolbar({ canvasRef }: EffectToolbarProps) {
  const { layers, selectedLayerId, updateLayer } = useDesignStore();

  const selectedLayer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
  const currentEffect = selectedLayer?.effect ?? 'none';

  const handleEffectChange = (effect: CraftEffect) => {
    if (!selectedLayerId) return;
    updateLayer(selectedLayerId, { effect });
    canvasRef?.current?.restoreFromStore();
  };

  if (!selectedLayerId) {
    return (
      <div className="effect-toolbar glass-panel" style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '0.85rem' }}>Effect</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Select a layer to assign an effect.</p>
      </div>
    );
  }

  return (
    <div className="effect-toolbar glass-panel" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--text-muted)' }}>
        <Sparkles size={16} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Effect</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {EFFECTS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleEffectChange(id)}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 6,
              border: `1px solid ${currentEffect === id ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
              background: currentEffect === id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
