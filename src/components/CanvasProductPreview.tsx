import { useRef, useEffect } from 'react';
import type { DesignConfig } from '@/services/fileGeneration';
import { FONT_LIBRARY } from '@/services/CustomizationEngine';

interface CanvasProductPreviewProps {
  config: DesignConfig & { zonePlacement?: { x: number; y: number; scale: number }; font?: string };
  width?: number;
  height?: number;
  logoUrl?: string;
  className?: string;
  /** Zone bounds 0-1 from schema (x, y, w, h) */
  zoneBounds?: { x: number; y: number; w: number; h: number };
}

/**
 * Canvas-based 2D product preview — text/logo only, no box.
 * Design is configurable: position, scale, font. Renders over product image.
 */
export function CanvasProductPreview({ config, width = 400, height = 300, logoUrl, className, zoneBounds }: CanvasProductPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const w = width;
    const h = height;
    const text = config.text || '';
    const subtext = config.subtext || '';

    // Design zone: use zoneBounds from schema, or full canvas
    const zb = zoneBounds ?? { x: 0.15, y: 0.15, w: 0.7, h: 0.7 };
    const zoneX = zb.x * w;
    const zoneY = zb.y * h;
    const zoneW = zb.w * w;
    const zoneH = zb.h * h;

    // Placement within zone (0–1): configurable via sliders
    const zp = config.zonePlacement ?? { x: 0.5, y: 0.5, scale: 1 };
    const posX = zoneX + zp.x * zoneW;
    const posY = zoneY + zp.y * zoneH;
    const scale = Math.max(0.3, Math.min(1.5, zp.scale ?? 1));

    ctx.clearRect(0, 0, w, h);

    const fontEntry = FONT_LIBRARY.find((f) => f.id === config.font) ?? FONT_LIBRARY[0];
    const fontFamily = fontEntry?.family ?? "'Segoe UI', system-ui, sans-serif";

    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = zoneW * 0.6 * scale;
        const maxH = zoneH * 0.5 * scale;
        const imgScale = Math.min(maxW / img.width, maxH / img.height, 1);
        const dw = img.width * imgScale;
        const dh = img.height * imgScale;
        ctx.drawImage(img, posX - dw / 2, posY - dh / 2, dw, dh);
      };
      img.src = logoUrl;
    } else if (text) {
      const baseFontSize = Math.min(28, zoneW / 6) * scale;
      const subFontSize = Math.min(14, zoneW / 12) * scale;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${baseFontSize}px ${fontFamily}`;

      const isDarkMaterial = config.material === 'acrylic_black' || config.material === 'metal_brushed';
      const mainColor = isDarkMaterial ? 'rgba(220,220,220,0.95)' : 'rgba(45,40,35,0.92)';
      const subColor = isDarkMaterial ? 'rgba(180,180,180,0.85)' : 'rgba(60,55,50,0.8)';

      ctx.fillStyle = mainColor;
      ctx.shadowColor = isDarkMaterial ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      ctx.fillText(text, posX, posY - (subtext ? baseFontSize * 0.35 : 0));

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      if (subtext) {
        ctx.font = `${subFontSize}px ${fontFamily}`;
        ctx.fillStyle = subColor;
        ctx.fillText(subtext, posX, posY + baseFontSize * 0.5);
      }
    }
  }, [config, width, height, logoUrl, zoneBounds]);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block', margin: '0 auto', background: 'transparent' }} />;
}
