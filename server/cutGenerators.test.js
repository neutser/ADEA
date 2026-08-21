import { describe, it, expect } from 'vitest';
import { GENERATORS, GENERATOR_KINDS, buildPiece, buildSheet } from './cutGenerators.js';

describe('generator registry', () => {
  it('exposes every generator by kind', () => {
    expect(GENERATOR_KINDS.length).toBeGreaterThanOrEqual(11);
    expect(GENERATOR_KINDS).toContain('drink-marker');
    for (const k of GENERATOR_KINDS) expect(typeof GENERATORS[k]).toBe('function');
  });

  it.each(GENERATOR_KINDS)('%s produces finite, non-empty geometry', (kind) => {
    const piece = buildPiece(kind, 'Morgan');
    expect(piece.paths.length).toBeGreaterThan(0);
    expect(piece.width).toBeGreaterThan(0);
    expect(piece.height).toBeGreaterThan(0);
    for (const d of piece.paths) {
      // A single NaN silently produces a path the cutter skips or mangles.
      expect(d, `${kind} emitted a malformed path`).not.toMatch(/NaN|undefined|Infinity/);
      expect(d.startsWith('M ')).toBe(true);
      expect(d.trim().endsWith('Z')).toBe(true);
    }
  });

  it.each(GENERATOR_KINDS)('%s survives awkward names', (kind) => {
    for (const name of ['I', 'Oluwaseun-Adebayo', "O'Neill", 'Ann Marie', '42']) {
      const piece = buildPiece(kind, name);
      expect(piece.width).toBeGreaterThan(0);
      expect(piece.paths.every((d) => !/NaN/.test(d))).toBe(true);
    }
  });

  it.each(GENERATOR_KINDS)('%s falls back rather than cutting an empty blank', (kind) => {
    expect(buildPiece(kind, '   ').paths.length).toBeGreaterThan(0);
  });

  it('rejects an unknown kind instead of cutting the wrong product', () => {
    expect(() => buildPiece('not-a-product', 'Alisa')).toThrow(/Unknown cut product/);
    const sheet = buildSheet('not-a-product', ['Alisa']);
    expect(sheet.svg).toBeNull();
    expect(sheet.error).toMatch(/Unknown cut product/);
  });
});

describe('buildSheet', () => {
  it.each(GENERATOR_KINDS)('%s tiles a list onto one sheet', (kind) => {
    const sheet = buildSheet(kind, ['Alisa', 'Morgan', 'Bo']);
    expect(sheet.count).toBe(3);
    expect(sheet.svg).toContain('<svg');
    expect((sheet.svg.match(/<g id="piece-/g) || []).length).toBe(3);
    expect(sheet.perRow).toBeGreaterThanOrEqual(1);
  });

  it('keeps every piece inside the sheet width', () => {
    const sheet = buildSheet('keychain', ['Alisa', 'Morgan', 'Jean-Luc', 'Bo'], { sheetWidthMM: 300, marginMM: 8 });
    expect(sheet.marginOverflow).toBeUndefined();
    expect(sheet.cellW * sheet.perRow).toBeLessThanOrEqual(300 - 8 * 2 + sheet.perRow * 5);
  });

  it('grows the sheet height as rows are added', () => {
    const few = buildSheet('favour-tag', ['A', 'B']);
    const many = buildSheet('favour-tag', Array.from({ length: 40 }, (_, i) => `Guest${i + 1}`));
    expect(many.rows).toBeGreaterThan(few.rows);
    expect(many.sheetHeightMM).toBeGreaterThanOrEqual(few.sheetHeightMM);
  });

  it('escapes names so a quote or tag cannot break the SVG', () => {
    const sheet = buildSheet('keychain', ['Tom & "Jerry"', '<script>']);
    expect(sheet.svg).toContain('&amp;');
    expect(sheet.svg).not.toContain('<script>');
    expect(sheet.svg).toContain('&lt;script&gt;');
  });

  it('marks cuts the way cutting software reads them', () => {
    const sheet = buildSheet('ornament', ['Noel']);
    expect(sheet.svg).toContain('fill="none"');
    expect(sheet.svg).toContain('stroke="#ff0000"');
  });

  it('scales pieces with the requested letter height', () => {
    const small = buildPiece('keychain', 'Priya', { fontSizeMM: 8 });
    const large = buildPiece('keychain', 'Priya', { fontSizeMM: 16 });
    expect(large.width).toBeGreaterThan(small.width);
    expect(large.height).toBeGreaterThan(small.height);
  });
});
