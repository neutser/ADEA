import { describe, it, expect } from 'vitest';
import { textToPath, measureText, loadFont } from './glyphPaths.js';

describe('glyphPaths', () => {
  it('emits real path geometry, never an SVG <text> element', () => {
    // A cutter has no fonts; <text> is not cuttable. This is the whole point
    // of the module, so assert on it directly.
    const { d } = textToPath('AB', 10);
    expect(d).toMatch(/^M /);
    expect(d).toContain('L ');
    expect(d).not.toContain('<text');
    expect(d.trim().endsWith('Z')).toBe(true);
  });

  it('produces one closed contour per glyph contour, counters included', () => {
    // "A" has an outer shape plus the triangular counter; "L" has one contour.
    const countM = (s) => (s.match(/M /g) || []).length;
    expect(countM(textToPath('A', 10).d)).toBe(2);
    expect(countM(textToPath('L', 10).d)).toBe(1);
    expect(countM(textToPath('ALISA', 10).d)).toBe(7);
  });

  it('places the baseline at y=0 with the glyph body above it (negative y)', () => {
    const { d } = textToPath('H', 10);
    const ys = [...d.matchAll(/-?\d+(?:\.\d+)?\s+(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    expect(Math.max(...ys)).toBeLessThanOrEqual(0.001);
    expect(Math.min(...ys)).toBeLessThan(0);
  });

  it('scales width linearly with font size', () => {
    const a = measureText('MORGAN', 10);
    const b = measureText('MORGAN', 20);
    expect(b / a).toBeCloseTo(2, 5);
  });

  it('grows width with more characters and honours letter spacing', () => {
    expect(measureText('AA', 10)).toBeGreaterThan(measureText('A', 10));
    const tight = measureText('ABC', 10, { letterSpacingMM: 0 });
    const loose = measureText('ABC', 10, { letterSpacingMM: 2 });
    expect(loose - tight).toBeCloseTo(4, 5); // spacing applies between glyphs only
  });

  it('advances the pen for spaces without emitting geometry for them', () => {
    const withSpace = textToPath('A B', 10);
    const noSpace = textToPath('AB', 10);
    expect(withSpace.width).toBeGreaterThan(noSpace.width);
    expect((withSpace.d.match(/M /g) || []).length).toBe((noSpace.d.match(/M /g) || []).length);
  });

  it('loads a font that actually carries outlines', () => {
    const font = loadFont();
    expect(font.resolution).toBeGreaterThan(0);
    expect(Object.keys(font.glyphs).length).toBeGreaterThan(50);
    expect(font.glyphs.A.o).toBeTruthy();
  });
});
