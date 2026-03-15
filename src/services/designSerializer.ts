/**
 * DesignSerializer — Convert Fabric objects ↔ JSON for save/load.
 * Supports config_version 2 layer-based design format.
 */

import type { FabricObject } from 'fabric';
import { util } from 'fabric';
import { applyCraftEffect } from '@/components/customization/CraftEffectRenderer';
import type { DesignDocument, DesignLayer, ZoneBounds } from '@/types/designEditor';

const { enlivenObjects } = util;

/** Serialize Fabric canvas to DesignDocument */
export function canvasToDesign(
  objects: FabricObject[],
  productId: string,
  zoneBounds: Record<string, ZoneBounds>,
  zoneId = 'main'
): DesignDocument {
  const layers: DesignLayer[] = objects
    .filter((obj) => obj && typeof (obj as FabricObject & { toObject?: () => object }).toObject === 'function')
    .map((obj, idx) => {
      const fabricObj = obj as FabricObject & { toObject: () => object };
      const fabricJson = fabricObj.toObject() as Record<string, unknown>;
      const data = fabricObj as FabricObject & { data?: { layerId?: string; effect?: string } };
      const layerId = data.data?.layerId ?? `layer-${Date.now()}-${idx}`;
      return {
        id: layerId,
        type: inferLayerType(fabricJson),
        effect: (data.data?.effect as DesignLayer['effect']) ?? 'none',
        fabricJson,
        zoneId,
        locked: false,
        visible: true,
        order: idx,
      };
    });

  return {
    productId,
    layers,
    zoneBounds,
    version: 1,
    configVersion: 2,
  };
}

/** Restore Fabric objects from DesignDocument (async for images) */
export async function designToObjects(
  doc: DesignDocument,
  zoneId = 'main'
): Promise<FabricObject[]> {
  const layers = doc.layers
    .filter((l) => l.zoneId === zoneId && l.visible)
    .sort((a, b) => a.order - b.order);

  const objects: FabricObject[] = [];
  for (const layer of layers) {
    try {
      const revived = await enlivenObjects([layer.fabricJson]);
      if (revived.length > 0 && revived[0]) {
        const obj = revived[0] as FabricObject & { set: (p: object) => void; data?: object };
        obj.set?.({ selectable: !layer.locked, evented: !layer.locked });
        (obj as FabricObject & { data?: object }).data = {
          layerId: layer.id,
          effect: layer.effect,
        };
        applyCraftEffect(obj, layer.effect);
        objects.push(obj);
      }
    } catch {
      // Skip failed layers (e.g. broken image src)
    }
  }
  return objects;
}

function inferLayerType(fabricJson: Record<string, unknown>): DesignLayer['type'] {
  const type = fabricJson.type as string | undefined;
  if (type === 'text' || type === 'i-text' || type === 'textbox') return 'text';
  if (type === 'image') return 'image';
  if (type === 'path') return 'path';
  if (['rect', 'circle', 'ellipse', 'triangle', 'polygon', 'polyline'].includes(type ?? '')) return 'shape';
  return 'image';
}

/** Build config_json for POST /api/designs (backward compatible) */
export function designToConfigJson(doc: DesignDocument): string {
  return JSON.stringify({
    config_version: 2,
    layers: doc.layers,
    zoneBounds: doc.zoneBounds,
    version: doc.version,
    legacy: {},
  });
}

/** Parse config_json from API into DesignDocument */
export function configJsonToDesign(configJson: string, productId: string): DesignDocument | null {
  try {
    const raw = JSON.parse(configJson);
    if (raw.config_version === 2 && Array.isArray(raw.layers)) {
      return {
        id: raw.id,
        productId,
        layers: raw.layers,
        zoneBounds: raw.zoneBounds ?? {},
        version: raw.version ?? 1,
        configVersion: 2,
      };
    }
    return null;
  } catch {
    return null;
  }
}
