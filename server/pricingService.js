/**
 * Server-side pricing calculation — evaluates product pricing rules.
 * Supports: fixed-plus-options, per-unit, area-based.
 */

/**
 * Calculate price from product schema, pricing rules, and config.
 */
export function calculateProductPrice(row, config, quantity = 1) {
  const schema = typeof row.customization_schema_json === 'string'
    ? JSON.parse(row.customization_schema_json)
    : row.customization_schema_json;
  const pricingRules = row.pricing_rules_json
    ? (typeof row.pricing_rules_json === 'string' ? JSON.parse(row.pricing_rules_json) : row.pricing_rules_json)
    : null;

  const opts = config || {};
  let total = 0;

  if (pricingRules?.type === 'area') {
    total = calculateAreaPrice(schema, pricingRules, opts, row.base_price);
  } else {
    total = row.base_price || 0;
    for (const field of schema?.fields || []) {
      const val = opts[field.id];
      if (!val) continue;
      if (field.type === 'checkbox' && val && field.priceAdd) {
        total += field.priceAdd;
      }
      if (field.options) {
        const opt = field.options.find((o) => o.id === val);
        if (opt?.priceAdd) total += opt.priceAdd;
      }
    }
  }

  const qty = Math.max(1, quantity || 1);
  let discount = 0;
  if (pricingRules?.tiers?.length) {
    for (const t of [...pricingRules.tiers].sort((a, b) => b.min - a.min)) {
      if (qty >= t.min) {
        discount = t.discount;
        break;
      }
    }
  } else {
    if (qty >= 50) discount = 0.2;
    else if (qty >= 25) discount = 0.15;
    else if (qty >= 10) discount = 0.1;
  }

  const unitPrice = Math.round(total * (1 - discount) * 100) / 100;
  const lineTotal = Math.round(unitPrice * qty * 100) / 100;

  return { unitPrice, lineTotal, quantity: qty, discount: Math.round(discount * 100) };
}

function calculateAreaPrice(schema, pricingRules, opts, basePrice) {
  const width = opts.width ?? 60;
  const height = width * 0.5;
  const area = width * height;

  let materialRate = 0.15;
  let thicknessMultiplier = 1;
  let ledMultiplier = 1;
  let mountPrice = 25;

  for (const field of schema?.fields || []) {
    const val = opts[field.id];
    if (!val || !field.options) continue;
    const opt = field.options.find((o) => o.id === val);
    if (!opt) continue;
    if (field.id === 'material' && opt.priceAdd !== undefined) {
      materialRate = 0.12 + (opt.priceAdd || 0) / 200;
    }
    if (field.id === 'thickness' && opt.multiplier) {
      thicknessMultiplier = opt.multiplier;
    }
    if (field.id === 'led' && opt.multiplier) {
      ledMultiplier = opt.multiplier;
    }
    if (field.id === 'mounting' && opt.priceAdd !== undefined) {
      mountPrice = opt.priceAdd;
    }
  }

  const total = area * materialRate * thicknessMultiplier * ledMultiplier + mountPrice + (basePrice || 100);
  return Math.round(total * 100) / 100;
}
