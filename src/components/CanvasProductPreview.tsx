import { useRef, useEffect } from 'react';
import type { DesignConfig } from '@/services/fileGeneration';

interface CanvasProductPreviewProps {
  config: DesignConfig;
  width?: number;
  height?: number;
  logoUrl?: string;
  className?: string;
}

/**
 * Canvas-based 2D product preview (A6).
 * Renders design config (text, shape, dimensions) to an HTML5 Canvas.
 */
export function CanvasProductPreview({ config, width = 400, height = 300, logoUrl, className }: CanvasProductPreviewProps) {
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
    const padding = 20;
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const shape = config.shape || 'rounded';
    const text = config.text || 'SAMPLE';
    const subtext = config.subtext || '';

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, innerW, innerH);

    const radius = shape === 'circle' ? Math.min(innerW, innerH) / 2 : shape === 'rounded' ? 12 : 0;
    ctx.beginPath();
    if (radius > 0 && 'roundRect' in ctx) {
      (ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(padding, padding, innerW, innerH, radius);
    } else {
      ctx.rect(padding, padding, innerW, innerH);
    }
    ctx.clip();

    ctx.fillStyle = config.material === 'acrylic_black' ? '#1a1a1a' : config.material === 'wood_oak' ? '#c4a574' : 'rgba(255,255,255,0.08)';
    ctx.fill();

    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = 'rgba(0,240,255,0.4)';
    ctx.lineWidth = 2;
    
    // LED Glow simulation (C6) for border
    ctx.shadowBlur = config.type === 'sign' ? 20 : 0;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';

    ctx.beginPath();
    if (radius > 0 && 'roundRect' in ctx) {
      (ctx as CanvasRenderingContext2D & { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(padding, padding, innerW, innerH, radius);
    } else {
      ctx.rect(padding, padding, innerW, innerH);
    }
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;

    const centerX = padding + innerW / 2;
    const centerY = padding + innerH / 2;

    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = innerW * 0.6;
        const maxH = innerH * 0.5;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        const dw = img.width * scale;
        const dh = img.height * scale;
        
        ctx.shadowBlur = config.type === 'sign' ? 15 : 0;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.drawImage(img, centerX - dw / 2, centerY - dh / 2 - 10, dw, dh);
        ctx.shadowBlur = 0;
      };
      img.src = logoUrl;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.min(24, innerW / 8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // LED Glow simulation (C6) for text
      ctx.shadowBlur = config.type === 'sign' ? 15 : 5;
      ctx.shadowColor = config.type === 'sign' ? 'rgba(0, 240, 255, 1)' : 'rgba(0,0,0,0.5)';
      
      ctx.fillText(text, centerX, centerY - (subtext ? 8 : 0));

      if (subtext) {
        ctx.font = `${Math.min(14, innerW / 12)}px sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(subtext, centerX, centerY + 16);
      }
      ctx.shadowBlur = 0;
    }
  }, [config, width, height, logoUrl]);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block', margin: '0 auto' }} />;
}
