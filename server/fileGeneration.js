/**
 * Product-specific file generation for production.
 * Branches by product type/category: SVG for signs/crafts, placeholder for embroidery.
 * Integrates manufacturing validation and panel split for large signs.
 */

import { validateForProduction, splitConfigIntoPanels } from './manufacturingValidation.js';

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** DXF format helpers — group codes for AutoCAD DXF */
function dxfLine(x1, y1, x2, y2) {
  return `  0\nLINE\n  8\n0\n 10\n${x1}\n 20\n${y1}\n 30\n0\n 11\n${x2}\n 21\n${y2}\n 31\n0\n`;
}
function dxfText(x, y, text, height = 5) {
  const escaped = String(text).replace(/\\/g, '\\\\').replace(/\\n/g, '\\P');
  return `  0\nTEXT\n  8\n0\n 10\n${x}\n 20\n${y}\n 30\n0\n 40\n${height}\n  1\n${escaped}\n 50\n0\n`;
}
function dxfSection(name, content) {
  return `  0\nSECTION\n  2\n${name}\n${content}  0\nENDSEC\n`;
}
function dxfFile(entities) {
  return `  0\nSECTION\n  2\nHEADER\n  9\n$ACADVER\n  1\nAC1015\n  0\nENDSEC\n  0\nSECTION\n  2\nTABLES\n  0\nENDSEC\n  0\nSECTION\n  2\nBLOCKS\n  0\nENDSEC\n  0\nSECTION\n  2\nENTITIES\n${entities}  0\nENDSEC\n  0\nEOF\n`;
}

/** Sign — DXF for laser/CNC (rectangle outline + text) */
function generateSignDXF(config) {
  const text = config.text || config.title || 'SAMPLE';
  const subtext = config.subtext || config.date || '';
  const widthCm = config.width || config.widthCm || 60;
  const w = widthCm * 10;
  const h = (config.heightCm || widthCm * 0.5) * 10;
  const slug = String(text).replace(/\s+/g, '_').slice(0, 20).toLowerCase() || 'design';
  let entities = dxfLine(0, 0, w, 0) + dxfLine(w, 0, w, h) + dxfLine(w, h, 0, h) + dxfLine(0, h, 0, 0);
  entities += dxfText(w / 2, h / 2 - 2, text, Math.max(3, w / 8));
  if (subtext) entities += dxfText(w / 2, h / 2 + 8, subtext, Math.max(2, w / 12));
  return { name: slug + '_cut.dxf', content: dxfFile(entities) };
}

/** Craft — DXF for laser engraving */
function generateCraftDXF(config) {
  const text = config.text || config.title || 'SAMPLE';
  const w = 80;
  const h = 50;
  const slug = String(text).replace(/\s+/g, '_').slice(0, 15).toLowerCase() || 'craft';
  let entities = dxfLine(0, 0, w, 0) + dxfLine(w, 0, w, h) + dxfLine(w, h, 0, h) + dxfLine(0, h, 0, 0);
  entities += dxfText(w / 2, h / 2 - 2, text, 6);
  if (config.subtext) entities += dxfText(w / 2, h / 2 + 6, config.subtext, 4);
  return { name: slug + '_craft.dxf', content: dxfFile(entities) };
}

/** DST placeholder for embroidery — minimal valid DXF-like placeholder */
function generateEmbroideryDSTPlaceholder(config) {
  const text = config.text || 'LOGO';
  return {
    name: `embroidery_${String(text).slice(0, 10).toLowerCase()}_placeholder.dst`,
    content: `# DST embroidery placeholder (full DST generation coming soon)\n# Product: ${config.productId || 'apparel'}\n# Text: ${text}\n`,
  };
}

/** Sign cut file — SVG for laser/CNC. Embeds logo/artwork when provided. */
function generateSignSVG(config) {
  const text = config.text || config.title || 'SAMPLE';
  const subtext = config.subtext || config.date || '';
  const widthCm = config.width || config.widthCm || 60;
  const w = widthCm * 10;
  const h = (config.heightCm || widthCm * 0.5) * 10;
  const r = config.shape === 'rounded' || config.shape === 'rounded-rect' ? 12 : 0;
  const slug = String(text).replace(/\s+/g, '_').slice(0, 20).toLowerCase() || 'design';
  const logoUrl = config.logo || config.artwork || config.photo;
  const zp = config.zonePlacement || { x: 0.5, y: 0.5, scale: 1 };
  const imgW = w * 0.7 * zp.scale;
  const imgH = h * 0.6 * zp.scale;
  const imgX = w * 0.15 + (w * 0.7) * zp.x - imgW / 2;
  const imgY = h * 0.15 + (h * 0.7) * zp.y - imgH / 2;
  let contentEls = [];
  if (logoUrl && typeof logoUrl === 'string' && (logoUrl.startsWith('data:') || logoUrl.startsWith('http'))) {
    contentEls.push('  <image href="' + escapeXml(logoUrl) + '" x="' + Math.max(0, imgX) + '" y="' + Math.max(0, imgY) + '" width="' + imgW + '" height="' + imgH + '" preserveAspectRatio="xMidYMid meet"/>');
  } else {
    contentEls.push('  <text x="' + (w / 2) + '" y="' + (h / 2 - 2) + '" class="text" text-anchor="middle">' + escapeXml(text) + '</text>');
    if (subtext) contentEls.push('  <text x="' + (w / 2) + '" y="' + (h / 2 + 8) + '" class="text" text-anchor="middle" font-size="' + Math.max(2, w / 12) + 'mm">' + escapeXml(subtext) + '</text>');
  }
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + 'mm" height="' + h + 'mm">',
    '  <defs><style>.text { font-family: sans-serif; font-size: ' + Math.max(3, w / 8) + 'mm; fill: #000; }</style></defs>',
    '  <rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + r + '" ry="' + r + '" fill="none" stroke="#000" stroke-width="0.5"/>',
    ...contentEls,
    '</svg>',
  ].join('\n');
  return { name: slug + '_cut.svg', content: svg };
}

/** Craft/keychain — SVG for laser engraving */
function generateCraftSVG(config) {
  const text = config.text || config.title || 'SAMPLE';
  const subtext = config.subtext || '';
  const w = 80;
  const h = 50;
  const r = config.shape === 'circle' ? 25 : config.shape === 'rounded' ? 8 : 0;
  const slug = String(text).replace(/\s+/g, '_').slice(0, 15).toLowerCase() || 'craft';
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + 'mm" height="' + h + 'mm">',
    '  <defs><style>.text { font-family: sans-serif; font-size: 6mm; fill: #000; }</style></defs>',
    '  <rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + r + '" ry="' + r + '" fill="none" stroke="#000" stroke-width="0.5"/>',
    '  <text x="' + (w / 2) + '" y="' + (h / 2 - 2) + '" class="text" text-anchor="middle">' + escapeXml(text) + '</text>',
    subtext ? '  <text x="' + (w / 2) + '" y="' + (h / 2 + 6) + '" class="text" text-anchor="middle" font-size="4mm">' + escapeXml(subtext) + '</text>' : '',
    '</svg>',
  ].filter(Boolean).join('\n');
  return { name: slug + '_craft.svg', content: svg };
}

/** Plaque — SVG for laser engraving */
function generatePlaqueSVG(config) {
  const title = config.title || config.text || 'AWARD';
  const recipient = config.recipient || '';
  const date = config.date || config.subtext || '';
  const w = 120;
  const h = 80;
  const slug = String(title).replace(/\s+/g, '_').slice(0, 12).toLowerCase() || 'plaque';
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + 'mm" height="' + h + 'mm">',
    '  <defs><style>.title { font-family: serif; font-size: 10mm; font-weight: bold; fill: #000; } .sub { font-size: 5mm; fill: #333; }</style></defs>',
    '  <rect x="0" y="0" width="' + w + '" height="' + h + '" fill="none" stroke="#000" stroke-width="0.5"/>',
    '  <text x="' + (w / 2) + '" y="' + (h / 2 - 10) + '" class="title" text-anchor="middle">' + escapeXml(title) + '</text>',
    recipient ? '  <text x="' + (w / 2) + '" y="' + (h / 2) + '" class="sub" text-anchor="middle">' + escapeXml(recipient) + '</text>' : '',
    date ? '  <text x="' + (w / 2) + '" y="' + (h / 2 + 10) + '" class="sub" text-anchor="middle">' + escapeXml(date) + '</text>' : '',
    '</svg>',
  ].filter(Boolean).join('\n');
  return { name: slug + '_plaque.svg', content: svg };
}

/** Sticker — SVG with contour cut (kiss-cut or die-cut) */
function generateStickerSVG(config) {
  const text = config.text || 'STICKER';
  const w = (config.size === '3inch' ? 76 : config.size === '4inch' ? 102 : config.size === '5inch' ? 127 : 51);
  const h = w;
  const slug = String(text).replace(/\s+/g, '_').slice(0, 12).toLowerCase() || 'sticker';
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + 'mm" height="' + h + 'mm">',
    '  <defs><style>.text { font-family: sans-serif; font-size: ' + Math.max(4, w / 6) + 'mm; fill: #000; }</style></defs>',
    '  <rect x="1" y="1" width="' + (w - 2) + '" height="' + (h - 2) + '" rx="4" fill="none" stroke="#000" stroke-width="0.5"/>',
    '  <text x="' + (w / 2) + '" y="' + (h / 2 + 2) + '" class="text" text-anchor="middle">' + escapeXml(text) + '</text>',
    '</svg>',
  ].join('\n');
  return { name: slug + '_sticker.svg', content: svg };
}

const DEFAULT_PRODUCTION = { bedSizeMM: [1200, 900], maxPanelCM: 120, autoSplit: true };

/** Layer-based design (config_version 2) — generate SVG from layers */
function generateLayerBasedSVG(config) {
  const layers = config.layers || [];
  const zoneBounds = config.zoneBounds || { main: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 } };
  const zone = zoneBounds.main || zoneBounds[Object.keys(zoneBounds)[0]] || { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
  const w = 80;
  const h = 50;
  const zx = zone.x * w;
  const zy = zone.y * h;
  const zw = zone.w * w;
  const zh = zone.h * h;
  const els = [];
  for (const layer of layers) {
    if (!layer.visible) continue;
    const o = layer.fabricJson || {};
    const left = (o.left ?? 0) + zx;
    const top = (o.top ?? 0) + zy;
    const scaleX = o.scaleX ?? 1;
    const scaleY = o.scaleY ?? 1;
    if (o.type === 'text' || o.type === 'i-text') {
      const text = (o.text ?? '').replace(/\n/g, ' ');
      const fontSize = (o.fontSize ?? 24) * scaleX;
      const fontFamily = o.fontFamily || 'sans-serif';
      els.push(`  <text x="${left}" y="${top + fontSize}" font-family="${escapeXml(fontFamily)}" font-size="${fontSize}" fill="${o.fill || '#000'}">${escapeXml(text)}</text>`);
    } else if (o.type === 'image' && o.src) {
      const ow = (o.width ?? 100) * scaleX;
      const oh = (o.height ?? 100) * scaleY;
      els.push(`  <image href="${escapeXml(o.src)}" x="${left}" y="${top}" width="${ow}" height="${oh}" preserveAspectRatio="xMidYMid meet"/>`);
    } else if (o.type === 'rect') {
      const rw = (o.width ?? 50) * scaleX;
      const rh = (o.height ?? 50) * scaleY;
      els.push(`  <rect x="${left}" y="${top}" width="${rw}" height="${rh}" fill="${o.fill || '#000'}" stroke="${o.stroke || 'none'}"/>`);
    } else if (o.type === 'circle') {
      const r = (o.radius ?? 25) * scaleX;
      els.push(`  <circle cx="${left + r}" cy="${top + r}" r="${r}" fill="${o.fill || '#000'}" stroke="${o.stroke || 'none'}"/>`);
    } else if (o.type === 'ellipse') {
      const rx = (o.rx ?? 40) * scaleX;
      const ry = (o.ry ?? 25) * scaleY;
      els.push(`  <ellipse cx="${left + rx}" cy="${top + ry}" rx="${rx}" ry="${ry}" fill="${o.fill || '#000'}" stroke="${o.stroke || 'none'}"/>`);
    }
  }
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + 'mm" height="' + h + 'mm">',
    '  <rect x="0" y="0" width="' + w + '" height="' + h + '" fill="none" stroke="#000" stroke-width="0.5"/>',
    ...els,
    '</svg>',
  ].join('\n');
  return { name: 'design_export.svg', content: svg };
}

/**
 * Generate production file(s). Returns array of { name, content }.
 * For large signs, may return multiple panel files.
 * @param {string} productId
 * @param {object} config
 * @param {object} [schema] - Product schema with production constraints
 * @param {string} [format] - 'svg' | 'dxf' | 'dst' | 'all' — defaults to 'all' for signs/crafts (SVG+DXF)
 * @returns {{ files: Array<{ name: string, content: string }>, validation?: object }}
 */
export function generateProductionFile(productId, config, schema, format = 'all') {
  if (config?.config_version === 2 && Array.isArray(config?.layers)) {
    const f = generateLayerBasedSVG(config);
    return { files: [{ name: f.name, content: f.content }], validation: { valid: true, errors: [], warnings: [] } };
  }

  const production = schema?.production || DEFAULT_PRODUCTION;
  const validation = validateForProduction(productId, config, production);
  if (!validation.valid) {
    throw new Error(`Manufacturing validation failed: ${validation.errors.join('; ')}`);
  }

  const cat = (productId || '').split('-')[0];
  const files = [];
  const addSvg = format === 'all' || format === 'svg';
  const addDxf = format === 'all' || format === 'dxf';
  const addDst = format === 'dst';

  if (productId?.includes('sign') || cat === 'signs') {
    const configs = validation.splitRequired && validation.suggestedPanels?.length
      ? splitConfigIntoPanels(config, production.maxPanelCM ?? 120)
      : [config];
    configs.forEach((panelConfig, i) => {
      const suffix = configs.length > 1 ? `_panel${i + 1}` : '';
      if (addSvg) {
        const f = generateSignSVG(panelConfig);
        files.push({ name: f.name.replace('.svg', `${suffix}.svg`), content: f.content });
      }
      if (addDxf) {
        const f = generateSignDXF(panelConfig);
        files.push({ name: f.name.replace('.dxf', `${suffix}.dxf`), content: f.content });
      }
    });
  } else if (productId?.includes('plaque') || cat === 'plaques') {
    if (addSvg) {
      const f = generatePlaqueSVG(config);
      files.push({ name: f.name, content: f.content });
    }
    if (addDxf) {
      const f = generateCraftDXF({ ...config, text: config.title || config.text });
      files.push({ name: f.name.replace('_craft', '_plaque'), content: f.content });
    }
  } else if (productId?.includes('sticker') || cat === 'stickers') {
    const f = generateStickerSVG(config);
    if (addSvg) files.push({ name: f.name, content: f.content });
  } else if (productId?.includes('apparel') || productId?.includes('hoodie') || productId?.includes('polo') || cat === 'apparel') {
    const craftConfig = { ...config, text: config.text || (config.logo ? 'LOGO' : 'SAMPLE') };
    if (addSvg) {
      const f = generateCraftSVG(craftConfig);
      files.push({ name: f.name, content: f.content });
    }
    if (addDst) {
      files.push(generateEmbroideryDSTPlaceholder({ ...craftConfig, productId }));
    }
  } else {
    if (addSvg) {
      const f = generateCraftSVG(config);
      files.push({ name: f.name, content: f.content });
    }
    if (addDxf) {
      const f = generateCraftDXF(config);
      files.push({ name: f.name, content: f.content });
    }
  }

  return { files, validation };
}

/** Legacy: for backward compatibility with bulk jobs that expect generateSVGFromConfig */
export function generateSVGFromConfig(config) {
  const result = generateProductionFile('craft', config);
  return result.files[0];
}
