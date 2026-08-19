/**
 * drinkMarker — cut geometry for personalized name drink-marker clips.
 *
 * One marker = the name in outlined letters, sitting on a thin connecting rail,
 * with an open C-clip that slides onto a wine or cocktail glass.
 *
 * The rail matters for manufacturability: cut letters are separate islands, so
 * without something joining them the machine returns a pile of loose glyphs.
 * The rail welds the name into one piece and carries the clip.
 *
 * All units are millimetres.
 */

import { textToPath, measureText } from './glyphPaths.js';

export const DEFAULTS = {
  fontSizeMM: 10,      // em size of the name
  railHeightMM: 1.8,   // bar joining the letters into one piece
  clipRadiusMM: 4.5,   // inner radius of the glass clip
  clipThicknessMM: 1.8,
  clipGapDeg: 95,      // opening the glass rim slides through
  letterSpacingMM: 0.4,
  sheetWidthMM: 300,
  sheetHeightMM: 200,
  marginMM: 8,
  gapMM: 5,
};

const round = (n) => Math.round(n * 1000) / 1000;
const polar = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
};

/**
 * Open C-clip as a closed contour: outer arc out, cap, inner arc back, cap.
 * `gapDeg` leaves the mouth the glass rim passes through.
 */
export function clipPath(cx, cy, innerR, thickness, gapDeg) {
  const outerR = innerR + thickness;
  const start = 90 + gapDeg / 2;
  const end = 450 - gapDeg / 2;
  const sweep = end - start;
  const largeArc = sweep > 180 ? 1 : 0;

  const [ox1, oy1] = polar(cx, cy, outerR, start);
  const [ox2, oy2] = polar(cx, cy, outerR, end);
  const [ix2, iy2] = polar(cx, cy, innerR, end);
  const [ix1, iy1] = polar(cx, cy, innerR, start);

  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2}`,
    `L ${ix2} ${iy2}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
    'Z',
  ].join(' ');
}

/** Rounded rail that welds the glyphs together. */
function railPath(x, y, w, h) {
  const r = Math.min(h / 2, w / 2);
  return [
    `M ${round(x + r)} ${round(y)}`,
    `L ${round(x + w - r)} ${round(y)}`,
    `A ${round(r)} ${round(r)} 0 0 1 ${round(x + w - r)} ${round(y + h)}`,
    `L ${round(x + r)} ${round(y + h)}`,
    `A ${round(r)} ${round(r)} 0 0 1 ${round(x + r)} ${round(y)}`,
    'Z',
  ].join(' ');
}

/**
 * Geometry for one marker, with its top-left at (0, 0).
 * Returns { paths, width, height }.
 */
export function buildMarker(name, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const label = String(name).trim() || 'NAME';
  const text = textToPath(label, o.fontSizeMM, { letterSpacingMM: o.letterSpacingMM });

  const clipDiameter = (o.clipRadiusMM + o.clipThicknessMM) * 2;
  const textWidth = Math.max(text.width, clipDiameter);

  // Baseline sits below the ascenders; the rail hangs directly under it.
  const baselineY = text.ascender;
  const railY = baselineY;
  const clipCx = Math.min(clipDiameter / 2, textWidth / 2);
  const clipCy = railY + o.railHeightMM + o.clipRadiusMM + o.clipThicknessMM;

  const paths = [];
  // Glyph outlines, shifted down so the baseline lands at baselineY.
  if (text.d) {
    paths.push(translatePath(text.d, 0, baselineY));
  }
  paths.push(railPath(0, railY, textWidth, o.railHeightMM));
  paths.push(clipPath(clipCx, clipCy, o.clipRadiusMM, o.clipThicknessMM, o.clipGapDeg));

  return {
    paths,
    width: round(textWidth),
    height: round(clipCy + o.clipRadiusMM + o.clipThicknessMM),
    label,
  };
}

/** Shift an absolute-command path by (dx, dy). */
function translatePath(d, dx, dy) {
  return d.replace(/([MLQCA])\s([^MLQCAZ]+)/g, (_, cmd, args) => {
    const nums = args.trim().split(/\s+/).map(Number);
    if (cmd === 'A') {
      // rx ry rot largeArc sweep x y — only the final pair is a coordinate.
      const [rx, ry, rot, la, sw, x, y] = nums;
      return `A ${rx} ${ry} ${rot} ${la} ${sw} ${round(x + dx)} ${round(y + dy)} `;
    }
    const shifted = nums.map((n, i) => round(i % 2 === 0 ? n + dx : n + dy));
    return `${cmd} ${shifted.join(' ')} `;
  });
}

/**
 * Lay every name out on one sheet, ready to cut — the deliverable the
 * customer actually wants from a list of names.
 */
export function buildMarkerSheet(names, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const list = (Array.isArray(names) ? names : String(names).split(/\r?\n/))
    .map((n) => String(n).trim())
    .filter(Boolean);

  if (list.length === 0) return { svg: null, count: 0, error: 'No names supplied.' };

  const markers = list.map((n) => buildMarker(n, o));
  const cellW = Math.max(...markers.map((m) => m.width));
  const cellH = Math.max(...markers.map((m) => m.height));
  const perRow = Math.max(1, Math.floor((o.sheetWidthMM - o.marginMM * 2 + o.gapMM) / (cellW + o.gapMM)));
  const rows = Math.ceil(markers.length / perRow);
  const sheetH = Math.max(o.sheetHeightMM, o.marginMM * 2 + rows * cellH + (rows - 1) * o.gapMM);

  const groups = markers.map((m, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const x = round(o.marginMM + col * (cellW + o.gapMM));
    const y = round(o.marginMM + row * (cellH + o.gapMM));
    const body = m.paths.map((d) => `      <path d="${d}" />`).join('\n');
    return `    <g id="marker-${i + 1}" data-name="${escapeXml(m.label)}" transform="translate(${x} ${y})">\n${body}\n    </g>`;
  });

  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${o.sheetWidthMM}mm" height="${round(sheetH)}mm" viewBox="0 0 ${o.sheetWidthMM} ${round(sheetH)}">`,
    `  <title>Drink marker clips — ${markers.length} names</title>`,
    // Hairline red stroke with no fill is the convention cutters read as "cut".
    '  <g fill="none" stroke="#ff0000" stroke-width="0.1">',
    groups.join('\n'),
    '  </g>',
    '</svg>',
  ].join('\n');

  return { svg, count: markers.length, perRow, rows, cellW, cellH, sheetHeightMM: round(sheetH) };
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
}
