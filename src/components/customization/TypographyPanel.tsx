/**
 * TypographyPanel — Font library, size, letter-spacing for text layers.
 */

import { useDesignStore } from '@/stores/designStore';
import { FONT_LIBRARY } from '@/services/CustomizationEngine';
import { Type } from 'lucide-react';

export interface TypographyPanelProps {
  canvasRef: React.RefObject<{ restoreFromStore: () => Promise<void> } | null>;
  onTextStyleChange?: (fontFamily: string, fontSize: number, letterSpacing?: number) => void;
}

export function TypographyPanel({ canvasRef }: TypographyPanelProps) {
  const { layers, selectedLayerId, updateLayer } = useDesignStore();

  const selectedLayer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
  const isTextLayer = selectedLayer?.type === 'text';

  if (!selectedLayerId || !isTextLayer) {
    return (
      <div className="typography-panel glass-panel" style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <Type size={16} />
          <span style={{ fontSize: '0.85rem' }}>Typography</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Select a text layer to edit.</p>
      </div>
    );
  }

  const fabricJson = selectedLayer.fabricJson as Record<string, unknown>;
  const storedFamily = (fabricJson.fontFamily as string) || 'Inter';
  const fontSize = (fabricJson.fontSize as number) || 24;

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fontId = e.target.value;
    const font = FONT_LIBRARY.find((f) => f.id === fontId) || FONT_LIBRARY[0];
    const familyName = font.family.split(',')[0].replace(/'/g, '').trim();
    const newJson = { ...fabricJson, fontFamily: familyName };
    updateLayer(selectedLayerId, { fabricJson: newJson });
    canvasRef?.current?.restoreFromStore();
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Math.max(8, Math.min(200, parseInt(e.target.value, 10) || 24));
    const newJson = { ...fabricJson, fontSize: size };
    updateLayer(selectedLayerId, { fabricJson: newJson });
    canvasRef?.current?.restoreFromStore();
  };

  return (
    <div className="typography-panel glass-panel" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--text-muted)' }}>
        <Type size={16} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Typography</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Font</label>
          <select
            value={FONT_LIBRARY.find((f) => f.family.includes(storedFamily))?.id ?? FONT_LIBRARY[0].id}
            onChange={handleFontChange}
            className="input-field"
            style={{ width: '100%', padding: '6px 8px', fontSize: '0.85rem' }}
          >
            {FONT_LIBRARY.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            Size: {fontSize}px
          </label>
          <input
            type="range"
            min={8}
            max={120}
            value={fontSize}
            onChange={handleSizeChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
