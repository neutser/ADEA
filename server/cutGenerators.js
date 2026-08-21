/**
 * cutGenerators — parametric cut geometry for name-driven products.
 *
 * Each generator turns one string into a finished piece: the text as real
 * outlined glyphs, a body that holds it, and whatever feature makes the thing
 * usable (a clip, a keyring hole, a cake pick, a hanging hole).
 *
 * Two rules apply throughout:
 *   1. Cut letters are separate islands. Anything text-only carries a rail or
 *      sits on a body, or the machine returns a pile of loose glyphs.
 *   2. Bodies size themselves to the text, so any name length stays in
 *      proportion instead of overflowing a fixed rectangle.
 *
 * All units are millimetres.
 */

import { textToPath } from './glyphPaths.js';
import {
  round, roundedRect, circle, hole, slot, cClip, spike, star, translatePath,
} from './cutShapes.js';

export const SHEET_DEFAULTS = {
  fontSizeMM: 10,
  sheetWidthMM: 300,
  sheetHeightMM: 200,
  marginMM: 8,
  gapMM: 5,
  letterSpacingMM: 0.4,
};

/** Text placed inside a box, horizontally centred and optically centred vertically. */
function placeText(label, fontSizeMM, boxX, boxY, boxW, boxH, opts = {}) {
  const t = textToPath(label, fontSizeMM, { letterSpacingMM: opts.letterSpacingMM ?? SHEET_DEFAULTS.letterSpacingMM });
  const dx = boxX + (boxW - t.width) / 2;
  const glyphHeight = t.ascender - t.descender;
  const dy = boxY + (boxH - glyphHeight) / 2 + t.ascender;
  return { d: t.d ? translatePath(t.d, dx, dy) : '', width: t.width, ascender: t.ascender, descender: t.descender };
}

const clean = (name, fallback = 'NAME') => String(name).trim() || fallback;

/* ── Generators ─────────────────────────────────────────────────────────── */

export const CLIP = { radiusMM: 4.5, thicknessMM: 1.8, gapDeg: 95, railMM: 1.8 };

/** Glass charm: name on a rail with a clip that pushes onto the rim. */
function drinkMarker(name, o) {
  const label = clean(name);
  const t = textToPath(label, o.fontSizeMM, { letterSpacingMM: o.letterSpacingMM });
  const railH = CLIP.railMM;
  const clipR = CLIP.radiusMM;
  const clipT = CLIP.thicknessMM;
  const width = Math.max(t.width, (clipR + clipT) * 2);
  const railY = t.ascender;
  const clipCy = railY + railH + clipR + clipT;
  return {
    paths: [
      t.d ? translatePath(t.d, 0, railY) : '',
      roundedRect(0, railY, width, railH, railH / 2),
      cClip(Math.min((clipR + clipT), width / 2), clipCy, clipR, clipT, CLIP.gapDeg),
    ].filter(Boolean),
    width: round(width),
    height: round(clipCy + clipR + clipT),
    label,
  };
}

/** Keyring tag: name on a rounded body with a split-ring hole. */
function keychain(name, o) {
  const label = clean(name);
  const padX = o.fontSizeMM * 0.6;
  const padY = o.fontSizeMM * 0.45;
  const holeD = 4;
  const t = textToPath(label, o.fontSizeMM, { letterSpacingMM: o.letterSpacingMM });
  const bodyH = o.fontSizeMM + padY * 2;
  const leadIn = holeD * 2;
  const bodyW = t.width + padX * 2 + leadIn;
  const text = placeText(label, o.fontSizeMM, leadIn, 0, bodyW - leadIn - padX * 0.2, bodyH, o);
  return {
    paths: [
      roundedRect(0, 0, bodyW, bodyH, bodyH / 2),
      hole(leadIn / 2, bodyH / 2, holeD),
      text.d,
    ].filter(Boolean),
    width: round(bodyW),
    height: round(bodyH),
    label,
  };
}

/** Small favour/gift tag: same idea as the keychain, thinner and with a cord hole. */
function favourTag(name, o) {
  const size = o.fontSizeMM * 0.8;
  const padX = size * 0.7;
  const holeD = 3;
  const t = textToPath(clean(name), size, { letterSpacingMM: o.letterSpacingMM });
  const bodyH = size + size * 0.9;
  const leadIn = holeD * 2.2;
  const bodyW = t.width + padX * 2 + leadIn;
  const text = placeText(clean(name), size, leadIn, 0, bodyW - leadIn - padX * 0.2, bodyH, o);
  return {
    paths: [
      roundedRect(0, 0, bodyW, bodyH, 2),
      hole(leadIn / 2, bodyH / 2, holeD),
      text.d,
    ].filter(Boolean),
    width: round(bodyW),
    height: round(bodyH),
    label: clean(name),
  };
}

/** Standing place card: the card plus the foot it slots into. */
function placeCard(name, o) {
  const label = clean(name);
  const t = textToPath(label, o.fontSizeMM, { letterSpacingMM: o.letterSpacingMM });
  const padX = o.fontSizeMM * 0.9;
  const cardW = t.width + padX * 2;
  const cardH = o.fontSizeMM * 2.4;
  const tabW = cardW * 0.35;
  const tabH = 3;
  const footW = cardW * 0.55;
  const footH = 10;
  const gap = 4;

  const text = placeText(label, o.fontSizeMM, 0, 0, cardW, cardH, o);
  // Tab under the card drops into the matching slot in the foot.
  const tab = roundedRect((cardW - tabW) / 2, cardH, tabW, tabH, 0.5);
  const footY = cardH + tabH + gap;
  const foot = roundedRect((cardW - footW) / 2, footY, footW, footH, 2);
  const footSlot = slot((cardW - tabW) / 2 + 0.15, footY + footH / 2 - 0.9, tabW - 0.3, 1.8);

  return {
    paths: [roundedRect(0, 0, cardW, cardH, 1.5), text.d, tab, foot, footSlot].filter(Boolean),
    width: round(cardW),
    height: round(footY + footH),
    label,
  };
}

/** Cake topper: name on a rail carried by two picks. */
function cakeTopper(name, o) {
  const label = clean(name);
  const size = o.fontSizeMM * 1.6;
  const t = textToPath(label, size, { letterSpacingMM: o.letterSpacingMM });
  const railH = 2.4;
  const width = Math.max(t.width, 20);
  const railY = t.ascender;
  const spikeLen = size * 2.2;
  const spikeW = 5;
  const inset = Math.min(width * 0.22, width / 2 - spikeW);
  return {
    paths: [
      t.d ? translatePath(t.d, 0, railY) : '',
      roundedRect(0, railY, width, railH, railH / 2),
      spike(inset + spikeW / 2, railY + railH, spikeW, spikeLen),
      spike(width - inset - spikeW / 2, railY + railH, spikeW, spikeLen),
    ].filter(Boolean),
    width: round(width),
    height: round(railY + railH + spikeLen),
    label,
  };
}

/** Round hanging ornament with the name across the middle. */
function ornament(name, o) {
  const label = clean(name);
  const size = o.fontSizeMM * 0.85;
  const t = textToPath(label, size, { letterSpacingMM: o.letterSpacingMM });
  const r = Math.max(t.width / 2 + size * 0.9, size * 2);
  const holeD = 3.5;
  const text = placeText(label, size, 0, 0, r * 2, r * 2, o);
  return {
    paths: [circle(r, r, r), hole(r, holeD * 1.4, holeD), text.d].filter(Boolean),
    width: round(r * 2),
    height: round(r * 2),
    label,
  };
}

/** Star ornament — same hanging hole, different silhouette. */
function starOrnament(name, o) {
  const label = clean(name);
  const size = o.fontSizeMM * 0.7;
  const t = textToPath(label, size, { letterSpacingMM: o.letterSpacingMM });
  const outerR = Math.max(t.width * 0.85, size * 3);
  const holeD = 3.5;
  const text = placeText(label, size, 0, 0, outerR * 2, outerR * 2, o);
  return {
    paths: [
      star(outerR, outerR, outerR, outerR * 0.45, 5),
      hole(outerR, outerR * 0.32, holeD),
      text.d,
    ].filter(Boolean),
    width: round(outerR * 2),
    height: round(outerR * 2),
    label,
  };
}

/** Bookmark: long body, name across it, tassel hole at the top. */
function bookmark(name, o) {
  const label = clean(name);
  const size = o.fontSizeMM * 0.9;
  const t = textToPath(label, size, { letterSpacingMM: o.letterSpacingMM });
  const bodyW = Math.max(t.width + size * 1.6, 34);
  const bodyH = 150;
  const holeD = 4;
  const text = placeText(label, size, 0, holeD * 3, bodyW, bodyH - holeD * 3, o);
  return {
    paths: [roundedRect(0, 0, bodyW, bodyH, 4), hole(bodyW / 2, holeD * 1.6, holeD), text.d].filter(Boolean),
    width: round(bodyW),
    height: round(bodyH),
    label,
  };
}

/** House number: digits on a rail with countersunk mounting holes. */
function houseNumber(value, o) {
  const label = clean(value, '00');
  const size = o.fontSizeMM * 4;
  const t = textToPath(label, size, { letterSpacingMM: o.letterSpacingMM });
  const railH = 4;
  const holeD = 4.5;
  const width = Math.max(t.width, 40);
  const railY = t.ascender;
  return {
    paths: [
      t.d ? translatePath(t.d, 0, railY) : '',
      roundedRect(0, railY, width, railH, railH / 2),
      hole(holeD * 1.4, railY + railH / 2, holeD * 0.55),
      hole(width - holeD * 1.4, railY + railH / 2, holeD * 0.55),
    ].filter(Boolean),
    width: round(width),
    height: round(railY + railH),
    label,
  };
}

/** Monogram coaster: initial centred on a round blank. */
function coaster(name, o) {
  const label = clean(name).slice(0, 3).toUpperCase();
  const r = 45;
  const size = o.fontSizeMM * 3;
  const text = placeText(label, size, 0, 0, r * 2, r * 2, o);
  return {
    paths: [circle(r, r, r), circle(r, r, r - 3), text.d].filter(Boolean),
    width: round(r * 2),
    height: round(r * 2),
    label,
  };
}

/** A matching pair of initial earrings, both cut in one cell. */
function earrings(name, o) {
  const label = clean(name).slice(0, 1).toUpperCase();
  const size = o.fontSizeMM * 0.9;
  const r = size * 1.1;
  const holeD = 1.6;
  const gap = 4;
  const one = (offsetX) => [
    translatePath(circle(r, r + holeD * 2, r), offsetX, 0),
    translatePath(hole(r, holeD * 1.2, holeD), offsetX, 0),
    translatePath(placeText(label, size, 0, holeD * 2, r * 2, r * 2, o).d, offsetX, 0),
  ];
  return {
    paths: [...one(0), ...one(r * 2 + gap)].filter(Boolean),
    width: round(r * 4 + gap),
    height: round(r * 2 + holeD * 2),
    label,
  };
}

export const GENERATORS = {
  'drink-marker': drinkMarker,
  keychain,
  'favour-tag': favourTag,
  'place-card': placeCard,
  'cake-topper': cakeTopper,
  ornament,
  'star-ornament': starOrnament,
  bookmark,
  'house-number': houseNumber,
  coaster,
  earrings,
};

export const GENERATOR_KINDS = Object.keys(GENERATORS);

/** Build one piece of the given kind. */
export function buildPiece(kind, name, opts = {}) {
  const gen = GENERATORS[kind];
  if (!gen) throw new Error(`Unknown cut product "${kind}".`);
  return gen(name, { ...SHEET_DEFAULTS, ...opts });
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
}

/**
 * Tile every name onto one sheet, ready to cut — the deliverable a customer
 * actually wants from a guest list.
 */
export function buildSheet(kind, names, opts = {}) {
  const o = { ...SHEET_DEFAULTS, ...opts };
  const list = (Array.isArray(names) ? names : String(names).split(/\r?\n/))
    .map((n) => String(n).trim())
    .filter(Boolean);

  if (list.length === 0) return { svg: null, count: 0, error: 'No names supplied.' };
  if (!GENERATORS[kind]) return { svg: null, count: 0, error: `Unknown cut product "${kind}".` };

  const pieces = list.map((n) => buildPiece(kind, n, o));
  const cellW = Math.max(...pieces.map((p) => p.width));
  const cellH = Math.max(...pieces.map((p) => p.height));
  const usable = o.sheetWidthMM - o.marginMM * 2;
  const perRow = Math.max(1, Math.floor((usable + o.gapMM) / (cellW + o.gapMM)));
  const rows = Math.ceil(pieces.length / perRow);
  const sheetH = Math.max(o.sheetHeightMM, o.marginMM * 2 + rows * cellH + Math.max(0, rows - 1) * o.gapMM);

  const groups = pieces.map((p, i) => {
    const x = round(o.marginMM + (i % perRow) * (cellW + o.gapMM));
    const y = round(o.marginMM + Math.floor(i / perRow) * (cellH + o.gapMM));
    const body = p.paths.map((d) => `      <path d="${d}" />`).join('\n');
    return `    <g id="piece-${i + 1}" data-name="${escapeXml(p.label)}" transform="translate(${x} ${y})">\n${body}\n    </g>`;
  });

  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${o.sheetWidthMM}mm" height="${round(sheetH)}mm" viewBox="0 0 ${o.sheetWidthMM} ${round(sheetH)}">`,
    `  <title>${escapeXml(kind)} — ${pieces.length} pieces</title>`,
    // No fill plus a hairline red stroke is what cutting software reads as "cut".
    '  <g fill="none" stroke="#ff0000" stroke-width="0.1">',
    groups.join('\n'),
    '  </g>',
    '</svg>',
  ].join('\n');

  return { svg, count: pieces.length, perRow, rows, cellW: round(cellW), cellH: round(cellH), sheetHeightMM: round(sheetH) };
}
