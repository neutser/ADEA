/**
 * drinkMarker — compatibility surface for the original drink-marker product.
 *
 * The geometry now lives in cutGenerators.js alongside every other cut
 * product, so there is one implementation rather than two. This module keeps
 * the original named exports pointing at it.
 */

import { buildPiece, buildSheet, SHEET_DEFAULTS, CLIP } from './cutGenerators.js';
import { cClip } from './cutShapes.js';

export const DEFAULTS = {
  ...SHEET_DEFAULTS,
  railHeightMM: CLIP.railMM,
  clipRadiusMM: CLIP.radiusMM,
  clipThicknessMM: CLIP.thicknessMM,
  clipGapDeg: CLIP.gapDeg,
};

export const clipPath = cClip;

export const buildMarker = (name, opts = {}) => buildPiece('drink-marker', name, opts);
export const buildMarkerSheet = (names, opts = {}) => buildSheet('drink-marker', names, opts);
