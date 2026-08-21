/**
 * cutShapes — reusable millimetre geometry for laser/vinyl cut products.
 *
 * Everything returns SVG path data using absolute commands only, so paths can
 * be translated by rewriting coordinate pairs (see translatePath). Shapes are
 * closed contours: a cutter traces the outline, it does not fill.
 */

export const round = (n) => Math.round(n * 1000) / 1000;

const polar = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
};

/** Rectangle with optional corner radius. */
export function roundedRect(x, y, w, h, r = 0) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  if (rad === 0) {
    return `M ${round(x)} ${round(y)} L ${round(x + w)} ${round(y)} L ${round(x + w)} ${round(y + h)} L ${round(x)} ${round(y + h)} Z`;
  }
  return [
    `M ${round(x + rad)} ${round(y)}`,
    `L ${round(x + w - rad)} ${round(y)}`,
    `A ${round(rad)} ${round(rad)} 0 0 1 ${round(x + w)} ${round(y + rad)}`,
    `L ${round(x + w)} ${round(y + h - rad)}`,
    `A ${round(rad)} ${round(rad)} 0 0 1 ${round(x + w - rad)} ${round(y + h)}`,
    `L ${round(x + rad)} ${round(y + h)}`,
    `A ${round(rad)} ${round(rad)} 0 0 1 ${round(x)} ${round(y + h - rad)}`,
    `L ${round(x)} ${round(y + rad)}`,
    `A ${round(rad)} ${round(rad)} 0 0 1 ${round(x + rad)} ${round(y)}`,
    'Z',
  ].join(' ');
}

/** Full circle as two arcs (a single arc cannot close a circle). */
export function circle(cx, cy, r) {
  return [
    `M ${round(cx - r)} ${round(cy)}`,
    `A ${round(r)} ${round(r)} 0 0 1 ${round(cx + r)} ${round(cy)}`,
    `A ${round(r)} ${round(r)} 0 0 1 ${round(cx - r)} ${round(cy)}`,
    'Z',
  ].join(' ');
}

/** Mounting / jump-ring hole, given a diameter. */
export const hole = (cx, cy, diameterMM) => circle(cx, cy, diameterMM / 2);

/** Stadium-shaped slot, used for card feet and hanging holes. */
export function slot(x, y, w, h) {
  return roundedRect(x, y, w, h, h / 2);
}

/** Open C-clip with a mouth the glass rim passes through. */
export function cClip(cx, cy, innerR, thickness, gapDeg) {
  const outerR = innerR + thickness;
  const start = 90 + gapDeg / 2;
  const end = 450 - gapDeg / 2;
  const largeArc = end - start > 180 ? 1 : 0;
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

/** Downward pick that pushes into a cake; pointed so it pierces cleanly. */
export function spike(cx, topY, widthMM, lengthMM) {
  const half = widthMM / 2;
  return [
    `M ${round(cx - half)} ${round(topY)}`,
    `L ${round(cx + half)} ${round(topY)}`,
    `L ${round(cx + half * 0.35)} ${round(topY + lengthMM * 0.75)}`,
    `L ${round(cx)} ${round(topY + lengthMM)}`,
    `L ${round(cx - half * 0.35)} ${round(topY + lengthMM * 0.75)}`,
    'Z',
  ].join(' ');
}

/** Regular star, used for ornaments and gift tags. */
export function star(cx, cy, outerR, innerR, points = 5) {
  const pts = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const [x, y] = polar(cx, cy, r, (180 / points) * i - 90);
    pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

/** Symmetric heart built from two cubic lobes. */
export function heart(cx, cy, size) {
  const s = size / 2;
  return [
    `M ${round(cx)} ${round(cy + s * 0.9)}`,
    `C ${round(cx - s * 1.4)} ${round(cy - s * 0.1)} ${round(cx - s * 0.8)} ${round(cy - s * 1.2)} ${round(cx)} ${round(cy - s * 0.45)}`,
    `C ${round(cx + s * 0.8)} ${round(cy - s * 1.2)} ${round(cx + s * 1.4)} ${round(cy - s * 0.1)} ${round(cx)} ${round(cy + s * 0.9)}`,
    'Z',
  ].join(' ');
}

/**
 * Shift a path built from absolute commands by (dx, dy).
 * Arc parameters are not coordinates apart from the trailing pair, so 'A' is
 * handled separately — shifting its radii would deform the shape.
 */
export function translatePath(d, dx, dy) {
  return d.replace(/([MLQCA])\s([^MLQCAZ]+)/g, (_, cmd, args) => {
    const nums = args.trim().split(/\s+/).map(Number);
    if (cmd === 'A') {
      const [rx, ry, rot, la, sw, x, y] = nums;
      return `A ${rx} ${ry} ${rot} ${la} ${sw} ${round(x + dx)} ${round(y + dy)} `;
    }
    return `${cmd} ${nums.map((n, i) => round(i % 2 === 0 ? n + dx : n + dy)).join(' ')} `;
  });
}
