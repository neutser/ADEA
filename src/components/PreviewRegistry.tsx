/**
 * Preview Registry — 2D only (3D disabled).
 * All products use CanvasProductPreview for flat-artwork customization.
 */

import { CanvasProductPreview } from './CanvasProductPreview';

export type PreviewType = 'scene' | 'product-overlay' | 'garment-overlay' | 'flat-artwork' |
  'multi-surface-card' | 'product-3d-mockup';

interface PreviewRegistryProps {
  previewType?: PreviewType;
  config: Record<string, unknown>;
  productCategory?: string;
  productSubcategory?: string;
  sceneImage?: string;
  isNightMode?: boolean;
  heroImage?: string;
  className?: string;
  /** Zone bounds 0-1 for 2D sync (from schema) */
  zoneBounds?: { x: number; y: number; w: number; h: number };
}

/**
 * Renders 2D preview for all products (3D disabled).
 */
export function PreviewRegistry({
  previewType: _previewType = 'flat-artwork',
  config,
  isNightMode = false,
  heroImage,
  className = '',
  zoneBounds,
}: PreviewRegistryProps) {
  const logoUrl = (config.artwork as string) || (config.logo as string) || (config.photo as string);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {heroImage && (
        <img
          src={heroImage}
          alt="Product"
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', opacity: isNightMode ? 0.5 : 0.65, transition: 'all 0.4s ease' }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 10, mixBlendMode: 'normal', transform: 'scale(1)' }}>
        <CanvasProductPreview
          config={config as any}
          width={450}
          height={320}
          logoUrl={logoUrl}
          className={className}
          zoneBounds={zoneBounds}
        />
      </div>
    </div>
  );
}
