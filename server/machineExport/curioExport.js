/**
 * Silhouette Curio 2 export — layered SVG for cut/score/emboss.
 * Import into Silhouette Studio.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * @param {object} design - { layers: [{ type, paths, name }] }
 * @returns {string} SVG with data-type attributes for cut/score/emboss
 */
export function toCurioLayers(design) {
  const layers = design?.layers || [];
  const width = 203;
  const height = 305;

  const groups = layers.map((l) => {
    const type = l.type || 'cut';
    const paths = l.paths || '';
    const pathEl = paths ? `<path d="${escapeXml(paths)}" fill="none" stroke="#000" stroke-width="0.5"/>` : '';
    return `  <g data-type="${type}" data-label="${escapeXml(l.name || type)}">\n    ${pathEl}\n  </g>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">`,
    `  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#ccc" stroke-width="0.1"/>`,
    ...groups,
    '</svg>',
  ].join('\n');
}
