/**
 * ZoneEditor — Visual zone definition on product mockup.
 * Admin draws rectangles to define design zones (0-1 normalized).
 */

import { useRef } from 'react';

export interface ZoneEditorProps {
  imageUrl: string;
  zones: Array<{ id: string; x: string; y: string; w: string; h: string }>;
  onChange?: (zones: Array<{ id: string; x: string; y: string; w: string; h: string }>) => void;
}

export function ZoneEditor({ imageUrl, zones }: ZoneEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pct = (v: string | number) => (typeof v === 'string' ? parseFloat(v.replace('%', '')) / 100 : v) || 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        aspectRatio: '4/3',
        background: '#222',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <img
        src={imageUrl}
        alt="Product"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {zones.map((z) => (
        <div
          key={z.id}
          style={{
            position: 'absolute',
            left: `${pct(z.x) * 100}%`,
            top: `${pct(z.y) * 100}%`,
            width: `${pct(z.w) * 100}%`,
            height: `${pct(z.h) * 100}%`,
            border: '2px dashed var(--accent-neon-blue)',
            background: 'rgba(0, 240, 255, 0.1)',
            pointerEvents: 'none',
          }}
        />
      ))}
      <p style={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Zones from schema. Edit schema to change bounds.
      </p>
    </div>
  );
}
