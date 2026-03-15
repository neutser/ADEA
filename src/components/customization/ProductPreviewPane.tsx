/**
 * ProductPreviewPane — Real-time composite of design onto product hero image.
 */

import { useState, useEffect, useRef } from 'react';
import { useDesignStore } from '@/stores/designStore';

export interface ProductPreviewPaneProps {
  canvasRef: React.RefObject<{ getPreviewDataUrl?: (format?: string) => string | null } | null>;
  width?: number;
  height?: number;
}

export function ProductPreviewPane({ canvasRef, width = 180, height = 180 }: ProductPreviewPaneProps) {
  const { heroImage, layers } = useDesignStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let tick = 0;
    const update = () => {
      const url = canvasRef?.current?.getPreviewDataUrl?.('png') ?? null;
      setPreviewUrl(url);
    };
    const schedule = () => {
      tick++;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };
    schedule();
    const id = setInterval(schedule, 800);
    return () => {
      clearInterval(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, layers]);

  if (!heroImage) return null;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
      }}
    >
      <img
        src={heroImage}
        alt="Product"
        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0 }}
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Design"
          style={{
            position: 'absolute',
            inset: '15%',
            objectFit: 'contain',
            mixBlendMode: 'multiply',
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}
