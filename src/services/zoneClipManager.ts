/**
 * ZoneClipManager — Clips canvas objects to product zones.
 * Handles flat zones and wrap (cylindrical) zones for mugs, etc.
 */

import type { ZoneBounds } from '@/types/designEditor';

export type ZoneType = 'flat' | 'wrap' | 'curved';

export interface ZoneDefinition {
  id: string;
  bounds: ZoneBounds;
  type: ZoneType;
}

/**
 * Convert zone bounds (0-1) to pixel coordinates.
 */
export function zoneToPixels(
  zone: ZoneBounds,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; w: number; h: number } {
  return {
    x: zone.x * canvasWidth,
    y: zone.y * canvasHeight,
    w: zone.w * canvasWidth,
    h: zone.h * canvasHeight,
  };
}

/**
 * Check if a point (0-1) is inside zone bounds.
 */
export function isPointInZone(
  px: number,
  py: number,
  zone: ZoneBounds
): boolean {
  return (
    px >= zone.x &&
    px <= zone.x + zone.w &&
    py >= zone.y &&
    py <= zone.y + zone.h
  );
}

/**
 * Constrain object position/size to stay within zone.
 * Returns adjusted { left, top, scaleX, scaleY } for Fabric object.
 */
export function constrainToZone(
  objLeft: number,
  objTop: number,
  objWidth: number,
  objHeight: number,
  zonePx: { x: number; y: number; w: number; h: number }
): { left: number; top: number; scaleX?: number; scaleY?: number } {
  let left = Math.max(zonePx.x, Math.min(zonePx.x + zonePx.w - objWidth, objLeft));
  let top = Math.max(zonePx.y, Math.min(zonePx.y + zonePx.h - objHeight, objTop));

  if (objWidth > zonePx.w || objHeight > zonePx.h) {
    const scaleX = objWidth > zonePx.w ? zonePx.w / objWidth : 1;
    const scaleY = objHeight > zonePx.h ? zonePx.h / objHeight : 1;
    const scale = Math.min(scaleX, scaleY);
    return {
      left: zonePx.x + (zonePx.w - objWidth * scale) / 2,
      top: zonePx.y + (zonePx.h - objHeight * scale) / 2,
      scaleX: scale,
      scaleY: scale,
    };
  }

  return { left, top };
}

/**
 * Create clip path for Fabric.js from zone bounds (pixel coords).
 */
export function createClipPath(
  zonePx: { x: number; y: number; w: number; h: number }
): string {
  return `M ${zonePx.x} ${zonePx.y} L ${zonePx.x + zonePx.w} ${zonePx.y} L ${zonePx.x + zonePx.w} ${zonePx.y + zonePx.h} L ${zonePx.x} ${zonePx.y + zonePx.h} Z`;
}
