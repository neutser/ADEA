/**
 * CustomizationEngine — Validates design configs against product schemas.
 * The Rules Engine is the core abstraction making infinite product types possible.
 */

/* ═══ TYPES ════════════════════════════════════════════════ */
export interface FieldOption {
  id: string;
  label: string;
  priceAdd?: number;
  multiplier?: number;
  hex?: string;
}

export interface SchemaField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'select' | 'radio' | 'checkbox' | 'slider' |
        'color-swatch' | 'font-picker' | 'icon-picker';
  label: string;
  required?: boolean;
  placeholder?: string;
  maxLen?: number;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  default?: string | number;
  unit?: string;
  options?: FieldOption[];
  icons?: string[];
  accept?: string;
  maxSizeMB?: number;
  minDPI?: number;
  priceAdd?: number;
}

export interface SurfaceZone {
  id: string;
  x: string;
  y: string;
  w: string;
  h: string;
}

export interface Surface {
  id: string;
  label: string;
  zones?: SurfaceZone[];
}

export interface PreviewConfig {
  type: 'scene' | 'product-overlay' | 'garment-overlay' | 'flat-artwork' |
        'multi-surface-card' | 'product-3d-mockup';
  scenes?: string[];
  background?: string;
}

export interface ProductionConstraints {
  minLineMM?: number;
  minTextMM?: number;
  maxPanelCM?: number;
  autoSplit?: boolean;
  bleedMM?: number;
  safeAreaMM?: number;
  minDPI?: number;
  wrapWidthMM?: number;
  wrapHeightMM?: number;
  sizeMM?: [number, number];
}

export interface CustomizationSchema {
  surfaces: Surface[];
  fields: SchemaField[];
  preview: PreviewConfig;
  production?: ProductionConstraints;
}

export interface PricingRules {
  type: 'fixed-plus-options' | 'area' | 'per-unit';
  formula?: string;
  minQty?: number;
  note?: string;
  tiers?: Array<{ min: number; discount: number }>;
}

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  base_price: number;
  hero_image: string;
  customization_schema: CustomizationSchema;
  pricing_rules: PricingRules | null;
  gallery: string[];
  tags: string[];
  is_quote_only: number;
  supports_bulk: number;
  estimated_days: number;
}

/* ═══ VALIDATION ═══════════════════════════════════════════ */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateConfig(
  schema: CustomizationSchema,
  config: Record<string, any>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const field of schema.fields) {
    const val = config[field.id];

    // Required check
    if (field.required !== false && !val && val !== 0) {
      if (field.type === 'image') {
        warnings.push(`${field.label} is recommended but optional.`);
      } else if (field.required) {
        errors.push(`${field.label} is required.`);
      }
    }

    // Text length
    if (field.type === 'text' && val && field.maxLen && String(val).length > field.maxLen) {
      errors.push(`${field.label} exceeds maximum length of ${field.maxLen} characters.`);
    }

    // Textarea length
    if (field.type === 'textarea' && val && field.maxLen && String(val).length > field.maxLen) {
      errors.push(`${field.label} exceeds maximum length of ${field.maxLen} characters.`);
    }

    // Slider range
    if (field.type === 'slider' || field.type === 'number') {
      if (val !== undefined) {
        if (field.min !== undefined && val < field.min) errors.push(`${field.label} minimum is ${field.min}.`);
        if (field.max !== undefined && val > field.max) errors.push(`${field.label} maximum is ${field.max}.`);
      }
    }

    // Select/radio must be a valid option
    if ((field.type === 'select' || field.type === 'radio' || field.type === 'color-swatch') && val && field.options) {
      if (!field.options.find(o => o.id === val)) {
        errors.push(`Invalid option for ${field.label}.`);
      }
    }
  }

  // Production constraints
  if (schema.production) {
    const p = schema.production;
    if (p.maxPanelCM && config.width && config.width > p.maxPanelCM) {
      if (p.autoSplit) {
        warnings.push(`Width exceeds ${p.maxPanelCM}cm — will be auto-split into panels.`);
      } else {
        errors.push(`Width ${config.width}cm exceeds max panel size ${p.maxPanelCM}cm.`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/* ═══ PRICING ══════════════════════════════════════════════ */
export function calculatePrice(
  schema: CustomizationSchema,
  pricingRules: PricingRules | null,
  basePrice: number,
  config: Record<string, any>,
  quantity: number = 1
): { unitPrice: number; lineTotal: number; discount: number } {
  let total = basePrice;

  // Sum priceAdd from selected options
  for (const field of schema.fields) {
    const val = config[field.id];
    if (!val) continue;

    if (field.type === 'checkbox' && val && field.priceAdd) {
      total += field.priceAdd;
    }

    if (field.options) {
      const opt = field.options.find(o => o.id === val);
      if (opt?.priceAdd) total += opt.priceAdd;
    }
  }

  // Quantity discount
  const qty = Math.max(1, quantity);
  let discount = 0;
  if (pricingRules?.tiers) {
    for (const t of [...pricingRules.tiers].sort((a, b) => b.min - a.min)) {
      if (qty >= t.min) { discount = t.discount; break; }
    }
  } else {
    if (qty >= 50) discount = 0.20;
    else if (qty >= 25) discount = 0.15;
    else if (qty >= 10) discount = 0.10;
  }

  const unitPrice = Math.round(total * (1 - discount) * 100) / 100;
  const lineTotal = Math.round(unitPrice * qty * 100) / 100;

  return { unitPrice, lineTotal, discount: Math.round(discount * 100) };
}

/* ═══ DEFAULTS ═════════════════════════════════════════════ */
export function buildDefaults(schema: CustomizationSchema): Record<string, any> {
  const config: Record<string, any> = {};
  for (const field of schema.fields) {
    if (field.default !== undefined) {
      config[field.id] = field.default;
    } else if (field.options && field.options.length > 0) {
      config[field.id] = field.options[0].id;
    } else if (field.type === 'text' || field.type === 'textarea') {
      config[field.id] = '';
    } else if (field.type === 'number' || field.type === 'slider') {
      config[field.id] = field.min ?? 0;
    } else if (field.type === 'checkbox') {
      config[field.id] = false;
    }
  }
  return config;
}

/* ═══ FONT OPTIONS ═════════════════════════════════════════ */
export const FONT_LIBRARY = [
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'roboto-slab', name: 'Roboto Slab', family: "'Roboto Slab', serif" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'oswald', name: 'Oswald', family: "'Oswald', sans-serif" },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive" },
  { id: 'bebas', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif" },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif" },
];

export const ICON_SYMBOLS: Record<string, string> = {
  none: '',
  heart: '❤️',
  star: '⭐',
  paw: '🐾',
  infinity: '♾️',
  anchor: '⚓',
  music: '🎵',
  tree: '🌲',
  crown: '👑',
  diamond: '💎',
  flame: '🔥',
  moon: '🌙',
};
