/**
 * CraftEffectRenderer — Apply craft effect styles to Fabric objects.
 * Simulates engrave (carved), emboss (raised), deboss (pressed) for preview.
 */

import type { FabricObject } from 'fabric';
import type { CraftEffect } from '@/types/designEditor';

const EFFECT_STYLES: Record<
  Exclude<CraftEffect, 'none' | 'foil' | 'uv' | 'laser'>,
  Partial<{
    fill: string;
    shadow: { color: string; blur: number; offsetX: number; offsetY: number };
    opacity: number;
    stroke: string;
    strokeWidth: number;
  }>
> = {
  engrave: {
    fill: 'rgba(80,80,80,0.9)',
    shadow: { color: 'rgba(0,0,0,0.4)', blur: 3, offsetX: 1, offsetY: 1 },
    opacity: 0.95,
  },
  emboss: {
    fill: 'rgba(220,220,220,0.95)',
    shadow: { color: 'rgba(0,0,0,0.35)', blur: 6, offsetX: 2, offsetY: 2 },
    opacity: 1,
  },
  deboss: {
    fill: 'rgba(100,100,100,0.9)',
    shadow: { color: 'rgba(255,255,255,0.2)', blur: 2, offsetX: -1, offsetY: -1 },
    opacity: 0.9,
  },
};

export function applyCraftEffect(obj: FabricObject, effect: CraftEffect | undefined): void {
  if (!effect || effect === 'none' || effect === 'foil' || effect === 'uv' || effect === 'laser') {
    clearCraftEffect(obj);
    return;
  }
  const style = EFFECT_STYLES[effect as keyof typeof EFFECT_STYLES];
  if (!style) return;
  const fabricObj = obj as FabricObject & {
    set: (props: object) => void;
    shadow?: object;
  };
  const updates: Record<string, unknown> = {};
  if (style.fill) updates.fill = style.fill;
  if (style.opacity !== undefined) updates.opacity = style.opacity;
  if (style.stroke) updates.stroke = style.stroke;
  if (style.strokeWidth !== undefined) updates.strokeWidth = style.strokeWidth;
  if (style.shadow) updates.shadow = style.shadow;
  fabricObj.set(updates);
}

export function clearCraftEffect(obj: FabricObject): void {
  const fabricObj = obj as FabricObject & { set: (props: object) => void };
  fabricObj.set({
    shadow: null,
    opacity: 1,
  });
}
