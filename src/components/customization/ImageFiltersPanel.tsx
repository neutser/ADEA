/**
 * ImageFiltersPanel — Brightness, contrast, grayscale for image layers.
 */

import { useDesignStore } from '@/stores/designStore';
import { Image as ImageIcon } from 'lucide-react';

export interface ImageFiltersPanelProps {
  canvasRef: React.RefObject<{ restoreFromStore: () => Promise<void> } | null>;
}

export function ImageFiltersPanel({ canvasRef }: ImageFiltersPanelProps) {
  const { layers, selectedLayerId, updateLayer } = useDesignStore();

  const selectedLayer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) : null;
  const isImageLayer = selectedLayer?.type === 'image';

  if (!selectedLayerId || !isImageLayer) {
    return (
      <div className="image-filters-panel glass-panel" style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <ImageIcon size={16} />
          <span style={{ fontSize: '0.85rem' }}>Image Filters</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Select an image layer to adjust.</p>
      </div>
    );
  }

  const fabricJson = selectedLayer.fabricJson as Record<string, unknown>;
  const filters = (fabricJson.filters as Array<Record<string, unknown>>) || [];
  const brightness = filters.find((f) => f.type === 'Brightness') as { brightness?: number } | undefined;
  const contrast = filters.find((f) => f.type === 'Contrast') as { contrast?: number } | undefined;
  const grayscale = filters.find((f) => f.type === 'Grayscale');

  const brightnessVal = brightness?.brightness ?? 0;
  const contrastVal = contrast?.contrast ?? 0;
  const isGrayscale = !!grayscale;

  const updateFilters = (newFilters: Array<Record<string, unknown>>) => {
    const newJson = { ...fabricJson, filters: newFilters };
    updateLayer(selectedLayerId, { fabricJson: newJson });
    canvasRef?.current?.restoreFromStore();
  };

  const handleBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const rest = filters.filter((f) => f.type !== 'Brightness');
    updateFilters([...rest, { type: 'Brightness', brightness: val }]);
  };

  const handleContrast = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const rest = filters.filter((f) => f.type !== 'Contrast');
    updateFilters([...rest, { type: 'Contrast', contrast: val }]);
  };

  const handleGrayscale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const rest = filters.filter((f) => f.type !== 'Grayscale');
    updateFilters(checked ? [...rest, { type: 'Grayscale' }] : rest);
  };

  return (
    <div className="image-filters-panel glass-panel" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--text-muted)' }}>
        <ImageIcon size={16} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Image Filters</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            Brightness: {brightnessVal}
          </label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.1}
            value={brightnessVal}
            onChange={handleBrightness}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            Contrast: {contrastVal}
          </label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.1}
            value={contrastVal}
            onChange={handleContrast}
            style={{ width: '100%' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={isGrayscale} onChange={handleGrayscale} />
          Grayscale
        </label>
      </div>
    </div>
  );
}
