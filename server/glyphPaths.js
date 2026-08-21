/**
 * glyphPaths — convert text into real outlined SVG path geometry.
 *
 * Laser/vinyl cutters need closed vector contours; an SVG <text> element is not
 * cuttable (the machine has no font). The three.js typeface JSON in
 * public/fonts holds true glyph outlines, so we walk those and emit path data.
 *
 * Typeface outline commands (three.js order — the END point comes FIRST):
 *   m x y                     moveTo
 *   l x y                     lineTo
 *   q endX endY cx cy         quadratic  -> SVG "Q cx cy endX endY"
 *   b endX endY c1x c1y c2x c2y   cubic  -> SVG "C c1x c1y c2x c2y endX endY"
 *
 * Font space is Y-up; SVG is Y-down, so every y is negated. Coordinates are
 * emitted in millimetres with the text baseline at y = 0.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(__dirname, '..', 'public', 'fonts', 'Inter_Bold.json');

let cachedFont = null;

export function loadFont() {
  if (cachedFont) return cachedFont;
  cachedFont = JSON.parse(fs.readFileSync(FONT_PATH, 'utf8'));
  return cachedFont;
}

const round = (n) => Math.round(n * 1000) / 1000;

/**
 * Outline for a single glyph, positioned with its origin at (penX, 0).
 * Returns '' for glyphs the font does not carry (e.g. a space).
 */
function glyphToPath(glyph, penX, scale) {
  if (!glyph || !glyph.o) return '';
  const tokens = String(glyph.o).split(/\s+/).filter(Boolean);
  const X = (v) => round(penX + Number(v) * scale);
  const Y = (v) => round(-Number(v) * scale); // Y-up -> Y-down
  const out = [];

  for (let i = 0; i < tokens.length; ) {
    const cmd = tokens[i++];
    switch (cmd) {
      case 'm':
        out.push(`M ${X(tokens[i++])} ${Y(tokens[i++])}`);
        break;
      case 'l':
        out.push(`L ${X(tokens[i++])} ${Y(tokens[i++])}`);
        break;
      case 'q': {
        const ex = X(tokens[i++]);
        const ey = Y(tokens[i++]);
        const cx = X(tokens[i++]);
        const cy = Y(tokens[i++]);
        out.push(`Q ${cx} ${cy} ${ex} ${ey}`);
        break;
      }
      case 'b': {
        const ex = X(tokens[i++]);
        const ey = Y(tokens[i++]);
        const c1x = X(tokens[i++]);
        const c1y = Y(tokens[i++]);
        const c2x = X(tokens[i++]);
        const c2y = Y(tokens[i++]);
        out.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`);
        break;
      }
      default:
        // Unknown command: skip it rather than emitting broken geometry.
        break;
    }
  }
  return out.length ? out.join(' ') + ' Z' : '';
}

/**
 * Convert a string into SVG path data at the given cap height in mm.
 * Returns { d, width, height } with the baseline at y = 0 and text starting at x = 0.
 */
export function textToPath(text, fontSizeMM, options = {}) {
  const font = loadFont();
  const resolution = font.resolution || 1000;
  const scale = fontSizeMM / resolution;
  const letterSpacing = (options.letterSpacingMM || 0);
  const chars = [...String(text)];

  let penX = 0;
  const parts = [];

  for (const ch of chars) {
    const glyph = font.glyphs[ch] || font.glyphs['?'];
    if (!glyph) continue;
    if (ch !== ' ') {
      const d = glyphToPath(glyph, penX, scale);
      if (d) parts.push(d);
    }
    penX += (glyph.ha || resolution * 0.5) * scale + letterSpacing;
  }

  const ascender = (font.boundingBox?.yMax ?? resolution) * scale;
  const descender = (font.boundingBox?.yMin ?? 0) * scale;

  return {
    d: parts.join(' '),
    width: round(Math.max(0, penX - letterSpacing)),
    height: round(ascender - descender),
    ascender: round(ascender),
    descender: round(descender),
  };
}

/** Width of a string at a given size, without building the geometry. */
export function measureText(text, fontSizeMM, options = {}) {
  const font = loadFont();
  const resolution = font.resolution || 1000;
  const scale = fontSizeMM / resolution;
  const letterSpacing = options.letterSpacingMM || 0;
  let w = 0;
  for (const ch of [...String(text)]) {
    const glyph = font.glyphs[ch] || font.glyphs['?'];
    if (!glyph) continue;
    w += (glyph.ha || resolution * 0.5) * scale + letterSpacing;
  }
  return round(Math.max(0, w - letterSpacing));
}
