/**
 * Guided AI Design & Quote System
 * Recommendation logic based on wizard answers
 */

export type ProductType = 'business-sign' | 'gift' | 'wedding' | 'clothing';
export type UsageLocation = 'indoor-wall' | 'outdoor-building' | 'apparel' | 'desk-decoration';
export type StylePreference = 'modern' | 'luxury' | 'minimal' | 'playful';

export interface WizardAnswers {
  productType: ProductType;
  hasLogoUpload: boolean;
  hasSpacePhoto: boolean;
  usageLocation: UsageLocation;
  style: StylePreference;
}

export interface DesignSuggestion {
  id: string;
  name: string;
  desc: string;
  img: string;
  link: string;
  priceRange: string;
  aiTip?: string;
}

export interface QuotePreview {
  product: string;
  size: string;
  material: string;
  lighting?: string;
  estimatedCost: string;
  productionTime: string;
}

/**
 * AI Product Recommendation – suggests products based on wizard answers
 */
export function getRecommendations(answers: WizardAnswers): DesignSuggestion[] {
  const { productType, hasLogoUpload, hasSpacePhoto, usageLocation, style } = answers;

  // Storefront / outdoor building photo → outdoor signs
  if (hasSpacePhoto && usageLocation === 'outdoor-building') {
    return [
      { id: 'outdoor-acrylic', name: 'Outdoor Acrylic Sign', desc: 'Durable, weather-resistant. Perfect for storefronts.', img: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$199–$800', aiTip: 'For outdoor visibility, we recommend 80–120 cm width.' },
      { id: 'led-halo', name: 'LED Halo Sign', desc: 'Illuminated for night visibility.', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$349–$900', aiTip: 'LED halo adds premium look and increases visibility after dark.' },
      { id: 'hours-plaque', name: 'Opening Hours Plaque', desc: 'Complement your main sign.', img: 'https://images.unsplash.com/photo-1556742049-2e852e7e0614?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$69–$149' },
    ];
  }

  // Logo only → office sign, apparel, keychains
  if (hasLogoUpload && !hasSpacePhoto) {
    const base = [
      { id: 'office-logo', name: 'Office Logo Sign', desc: '3D layered acrylic for reception or lobby.', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$299–$1,200', aiTip: 'For reception walls, 80–120 cm creates strong presence.' },
      { id: 'embroidered-polo', name: 'Embroidered Polo', desc: 'Premium stitched logo on chest.', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80', link: '/marketplace/configure?product=craft-mug', priceRange: '$32+', aiTip: 'Embroidery works better than print for detailed logos.' },
      { id: 'logo-keychain', name: 'Logo Keychain', desc: 'Acrylic or wooden with your logo.', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80', link: '/marketplace/configure?product=craft-keychain', priceRange: '$8–$15' },
    ];
    if (productType === 'clothing') return base.filter(b => b.id === 'embroidered-polo' || b.id === 'logo-keychain');
    if (productType === 'gift') return base.filter(b => b.id !== 'office-logo');
    return base;
  }

  // Baby name / personal text (no logo) → nursery, gifts
  if (!hasLogoUpload && (productType === 'gift' || productType === 'wedding')) {
    return [
      { id: 'nursery-sign', name: 'Nursery Wall Sign', desc: 'Personalized baby name sign.', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', link: '/marketplace/configure?product=plaque-award', priceRange: '$79–$129' },
      { id: 'baby-plaque', name: 'Baby Name Plaque', desc: 'Elegant engraved plaque.', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', link: '/marketplace/configure?product=plaque-award', priceRange: '$69–$99' },
      { id: 'personalized-gift', name: 'Personalized Gift', desc: 'Keychain, coaster, or plaque.', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80', link: '/marketplace/configure?product=craft-keychain', priceRange: '$8–$89' },
    ];
  }

  // Wedding
  if (productType === 'wedding') {
    return [
      { id: 'welcome-sign', name: 'Wedding Welcome Sign', desc: 'Acrylic or wood welcome sign.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', link: '/marketplace/configure?product=craft-welcome', priceRange: '$149–$299', aiTip: 'Bulk guest tags? Upload a CSV for automatic generation.' },
      { id: 'table-numbers', name: 'Table Number Signs', desc: 'Elegant table numbers.', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80', link: '/marketplace/configure?product=craft-welcome', priceRange: '$15/ea' },
      { id: 'guest-tags', name: 'Guest Name Place Cards', desc: 'Personalized place cards.', img: 'https://images.unsplash.com/photo-1563503541575-cf60b134d1dd?w=400&q=80', link: '/marketplace/configure?product=craft-welcome', priceRange: '$2/ea' },
    ];
  }

  // Business sign – design variations
  if (productType === 'business-sign') {
    return [
      { id: 'acrylic-layered', name: 'Acrylic Layered Sign', desc: '3D depth, premium look.', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$299–$1,200', aiTip: style === 'luxury' ? 'Layered acrylic suits luxury interiors.' : undefined },
      { id: 'led-halo', name: 'LED Halo Sign', desc: 'Illuminated edge lighting.', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$449–$900', aiTip: usageLocation === 'outdoor-building' ? 'LED recommended for outdoor visibility.' : undefined },
      { id: 'metal-look', name: 'Metal-Look Sign', desc: 'Brushed brass or matte black.', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$399–$800', aiTip: style === 'minimal' ? 'Matte black fits minimal aesthetics.' : undefined },
    ];
  }

  // Clothing – design variations
  if (productType === 'clothing') {
    return [
      { id: 'embroidered-chest', name: 'Embroidered Chest Logo', desc: 'Classic left chest placement.', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80', link: '/marketplace/configure?product=craft-mug', priceRange: '$32+', aiTip: 'Embroidery works better for logos with fine details.' },
      { id: 'large-back', name: 'Large Back Print', desc: 'Full-color DTF back print.', img: 'https://images.unsplash.com/photo-1556821840-0a63f95609a7?w=400&q=80', link: '/marketplace/configure?product=apparel-hoodie', priceRange: '$45+', aiTip: 'DTF print for full-color or photographic designs.' },
      { id: 'sleeve-logo', name: 'Sleeve Logo', desc: 'Subtle sleeve branding.', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80', link: '/marketplace/configure?product=craft-mug', priceRange: '$28+' },
    ];
  }

  // Default
  return [
    { id: 'sign', name: '3D Logo Sign', desc: 'Custom signage for any space.', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$299+' },
    { id: 'gift', name: 'Personalized Gift', desc: 'Keychains, coasters, plaques.', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80', link: '/marketplace/configure?product=craft-keychain', priceRange: '$8+' },
  ];
}

/**
 * Generate design variations for comparison (e.g. LED vs non-LED, gold vs black)
 */
export function getDesignComparisons(productType: ProductType): { a: DesignSuggestion; b: DesignSuggestion; label: string }[] {
  if (productType === 'business-sign') {
    return [
      {
        label: 'LED vs Non-LED',
        a: { id: 'led', name: 'LED Halo', desc: 'Illuminated', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=300&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$449+' },
        b: { id: 'no-led', name: 'No LED', desc: 'Matte finish', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$299+' },
      },
      {
        label: 'Gold Acrylic vs Black',
        a: { id: 'gold', name: 'Gold / Brass', desc: 'Luxury look', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$399+' },
        b: { id: 'black', name: 'Matte Black', desc: 'Modern minimal', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', link: '/marketplace/configure?product=craft-sign', priceRange: '$299+' },
      },
    ];
  }
  if (productType === 'clothing') {
    return [
      {
        label: 'Embroidery vs DTF Print',
        a: { id: 'emb', name: 'Embroidery', desc: 'Stitched, premium', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&q=80', link: '/marketplace/configure?product=craft-mug', priceRange: '+$8' },
        b: { id: 'dtf', name: 'DTF Print', desc: 'Full color, smooth', img: 'https://images.unsplash.com/photo-1556821840-0a63f95609a7?w=300&q=80', link: '/marketplace/configure?product=apparel-hoodie', priceRange: '+$5' },
      },
    ];
  }
  return [];
}

/**
 * Generate quote preview for business signs
 */
export function generateQuotePreview(answers: WizardAnswers, selectedDesign?: DesignSuggestion): QuotePreview {
  const size = answers.usageLocation === 'outdoor-building' ? '120 cm' : '80 cm';
  const material = answers.style === 'luxury' ? 'Brushed brass' : answers.style === 'minimal' ? 'Matte black acrylic' : 'Clear acrylic';
  const hasLED = selectedDesign?.id?.includes('led') ?? false;
  const base = 400;
  const sizeMult = answers.usageLocation === 'outdoor-building' ? 1.4 : 1;
  const ledAdd = hasLED ? 150 : 0;
  const low = Math.round((base * sizeMult + ledAdd) * 0.9);
  const high = Math.round((base * sizeMult + ledAdd) * 1.2);

  return {
    product: selectedDesign?.name ?? '3D Acrylic Logo Sign',
    size,
    material,
    lighting: hasLED ? 'LED halo (warm white)' : undefined,
    estimatedCost: `CHF ${low}–${high}`,
    productionTime: '7–10 days',
  };
}
