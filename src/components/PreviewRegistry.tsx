/**
 * Preview Registry — maps schema preview.type to the appropriate preview component.
 * Enables product-specific preview modes from backend schema.
 */

import ThreeDProductPreview from './ThreeDProductPreview';
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
}

/**
 * Renders the appropriate preview based on schema preview.type.
 * Signs and plaques use ThreeDProductPreview; scene type shows scene backdrop when available.
 */
export function PreviewRegistry({
  previewType = 'product-overlay',
  config,
  productCategory,
  productSubcategory,
  sceneImage,
  isNightMode = false,
  heroImage,
  className = '',
}: PreviewRegistryProps) {
  const isSign = productCategory === 'signs' || previewType === 'scene' || previewType === 'product-3d-mockup';
  const isApparel = productCategory === 'apparel' || previewType === 'garment-overlay';
  const is3DMarketplace = previewType === 'product-3d-mockup' || 
    productSubcategory?.includes('bottle') ||
    productSubcategory?.includes('board') ||
    productSubcategory?.includes('cutting') ||
    productSubcategory?.includes('pillow') ||
    productSubcategory?.includes('candle') ||
    productSubcategory?.includes('cap') ||
    productSubcategory?.includes('phone') ||
    productSubcategory?.includes('case') ||
    productSubcategory?.includes('glass') ||
    productSubcategory?.includes('wine') ||
    productSubcategory?.includes('box') ||
    productSubcategory?.includes('keepsake') ||
    productSubcategory?.includes('award') ||
    productSubcategory?.includes('trophy') ||
    productSubcategory?.includes('neon') ||
    productSubcategory?.includes('journal') ||
    productSubcategory?.includes('notebook');

  // Scene preview: show 3D product over scene image when available
  if (previewType === 'scene' && sceneImage) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: `url(${sceneImage}) center/cover` }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60%', height: '70%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <ThreeDProductPreview
              config={config}
              productType={productSubcategory}
              materialFinish={(config.material as string) || (config.garment_color as string) || 'matte_black'}
              isNightMode={isNightMode}
            />
          </div>
        </div>
      </div>
    );
  }

  // 3D Rendering Path (Signs, Apparel, Mugs, Keychains)
  if (isSign || isApparel || is3DMarketplace) {
    return (
      <ThreeDProductPreview
        config={config}
        productType={productSubcategory || (isApparel ? 'apparel' : 'sign')}
        materialFinish={(config.material as string) || (config.garment_color as string) || 'matte_black'}
        isNightMode={isNightMode}
      />
    );
  }

  // Real Mockup Render for Other Products (Cutting Boards, Invitations, Journals, etc)
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Background Hero Mockup */}
      {heroImage && (
        <img 
          src={heroImage} 
          alt="Product Mockup" 
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', opacity: isNightMode ? 0.3 : 1, transition: 'all 0.4s ease' }} 
        />
      )}
      
      {/* Dynamic Smart Object Rendering (Canvas or CSS overlay based on config) */}
      <div style={{ position: 'relative', zIndex: 10, mixBlendMode: isNightMode ? 'screen' : 'multiply', transform: 'scale(1.1)' }}>
        <CanvasProductPreview 
          config={config as any} 
          width={450} 
          height={320} 
          logoUrl={(config.artwork as string) || (config.logo as string) || (config.photo as string)} 
          className={className}
        />
      </div>
    </div>
  );
}
