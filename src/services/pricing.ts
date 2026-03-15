/**
 * Dynamic pricing engine for custom manufacturing
 * Admin can edit rules via config; factors: material, dimensions, qty, complexity, LED
 */

export interface MaterialPricing {
  id: string;
  name: string;
  basePricePerCm2: number;
  minOrder?: number;
}

export interface LEDPricing {
  id: string;
  name: string;
  multiplier: number;
  fixedFee?: number;
}

export interface PricingFactors {
  material: MaterialPricing;
  led?: LEDPricing;
  widthCm: number;
  heightCm?: number;
  quantity: number;
  setupFee?: number;
  complexityMultiplier?: number;
}

/**
 * Calculate sign price from dimensions, material, LED, quantity
 */
export function calculateSignPrice(factors: PricingFactors): number {
  const { material, led, widthCm, heightCm = widthCm * 0.5, quantity, setupFee = 100, complexityMultiplier = 1 } = factors;
  const area = widthCm * heightCm;
  let basePrice = area * material.basePricePerCm2 + setupFee;
  if (led) {
    basePrice *= led.multiplier;
    if (led.fixedFee) basePrice += led.fixedFee;
  }
  basePrice *= complexityMultiplier;
  // Quantity discount
  let qtyMultiplier = 1;
  if (quantity >= 50) qtyMultiplier = 0.8;
  else if (quantity >= 25) qtyMultiplier = 0.85;
  else if (quantity >= 10) qtyMultiplier = 0.9;
  return Math.round(basePrice * quantity * qtyMultiplier);
}

/**
 * Bulk discount percentage by quantity
 */
export function getBulkDiscountPercent(quantity: number): number {
  if (quantity >= 50) return 20;
  if (quantity >= 25) return 15;
  if (quantity >= 10) return 10;
  return 0;
}
