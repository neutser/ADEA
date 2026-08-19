import { describe, it, expect } from 'vitest';
import { buildMarker, buildMarkerSheet, clipPath, DEFAULTS } from './drinkMarker.js';

describe('buildMarker', () => {
  it('builds the name, the connecting rail and the glass clip', () => {
    // Three contours: glyph outlines, the rail welding them into one piece,
    // and the C-clip. Drop any one and the product does not work.
    const m = buildMarker('ALISA');
    expect(m.paths).toHaveLength(3);
    expect(m.paths.every((d) => d.startsWith('M '))).toBe(true);
    expect(m.label).toBe('ALISA');
  });

  it('sizes close to the real-world reference piece', () => {
    // Reference: a 5-letter name measures about 42mm wide.
    const m = buildMarker('ALISA');
    expect(m.width).toBeGreaterThan(35);
    expect(m.width).toBeLessThan(50);
    expect(m.height).toBeGreaterThan(15);
  });

  it('widens for longer names and never narrower than the clip', () => {
    expect(buildMarker('Oluwaseun').width).toBeGreaterThan(buildMarker('Bo').width);
    const minWidth = (DEFAULTS.clipRadiusMM + DEFAULTS.clipThicknessMM) * 2;
    expect(buildMarker('I').width).toBeGreaterThanOrEqual(minWidth);
  });

  it('scales with the requested letter height', () => {
    expect(buildMarker('Priya', { fontSizeMM: 16 }).width)
      .toBeGreaterThan(buildMarker('Priya', { fontSizeMM: 8 }).width);
  });

  it('falls back to a placeholder rather than emitting an empty cut', () => {
    expect(buildMarker('   ').label).toBe('NAME');
  });
});

describe('clipPath', () => {
  it('is a closed contour with an opening for the glass rim', () => {
    const d = clipPath(0, 0, 4.5, 1.8, 95);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.trim().endsWith('Z')).toBe(true);
    // Two arcs: outer sweep out, inner sweep back.
    expect((d.match(/A /g) || []).length).toBe(2);
  });
});

describe('buildMarkerSheet', () => {
  it('lays every name out on one sheet', () => {
    const names = ['Alisa', 'Morgan', 'Jean-Luc', 'Bo', 'Priya', 'Oluwaseun'];
    const sheet = buildMarkerSheet(names);
    expect(sheet.count).toBe(6);
    expect(sheet.svg).toContain('<svg');
    for (const n of names) expect(sheet.svg).toContain(`data-name="${n}"`);
    expect((sheet.svg.match(/<g id="marker-/g) || []).length).toBe(6);
  });

  it('accepts a newline-separated string and ignores blank lines', () => {
    const sheet = buildMarkerSheet('Alisa\n\n  \nMorgan\n');
    expect(sheet.count).toBe(2);
  });

  it('reports an error instead of emitting an empty sheet', () => {
    const sheet = buildMarkerSheet('   \n  ');
    expect(sheet.svg).toBeNull();
    expect(sheet.error).toBeTruthy();
  });

  it('escapes names so a quote or ampersand cannot break the SVG', () => {
    // Names are customer input written into an XML attribute.
    const sheet = buildMarkerSheet(['Tom & "Jerry"', "O'Neill", '<script>']);
    expect(sheet.svg).toContain('&amp;');
    expect(sheet.svg).toContain('&quot;');
    expect(sheet.svg).not.toContain('<script>');
    expect(sheet.svg).toContain('&lt;script&gt;');
  });

  it('wraps onto more rows as the list grows', () => {
    const few = buildMarkerSheet(['Al', 'Bo']);
    const many = buildMarkerSheet(Array.from({ length: 24 }, (_, i) => `Guest${i + 1}`));
    expect(many.rows).toBeGreaterThan(few.rows);
    expect(many.sheetHeightMM).toBeGreaterThanOrEqual(few.sheetHeightMM);
  });

  it('marks cuts as unfilled hairline strokes, the convention cutters read', () => {
    const sheet = buildMarkerSheet(['Alisa']);
    expect(sheet.svg).toContain('fill="none"');
    expect(sheet.svg).toContain('stroke="#ff0000"');
    expect(sheet.svg).toContain('mm"');
  });
});
