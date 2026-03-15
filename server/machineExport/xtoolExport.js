/**
 * xTool / LightBurn export — DXF or SVG for laser cutting/engraving.
 * LightBurn .lbrn2 is XML-based; we output SVG for compatibility.
 */

/**
 * @param {object} design - { layers: [{ type, paths, name }] }
 * @param {object} material - { thicknessMM, type }
 * @returns {string} SVG with engrave/cut paths
 */
export function toLightBurnSVG(design, material = {}) {
  const layers = design?.layers || [];
  const width = 406;
  const height = 432;

  const groups = layers.map((l) => {
    const type = l.type || 'cut';
    const paths = l.paths || '';
    const stroke = type === 'engrave' ? '#ff0000' : '#0000ff';
    const strokeWidth = type === 'engrave' ? 0.1 : 0.5;
    const pathEl = paths ? `<path d="${paths.replace(/"/g, '&quot;')}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>` : '';
    return `  <g data-type="${type}">\n    ${pathEl}\n  </g>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">`,
    `  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#ccc" stroke-width="0.1"/>`,
    ...groups,
    '</svg>',
  ].join('\n');
}
