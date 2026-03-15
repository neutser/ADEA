/**
 * DesignCanvas — Fabric.js canvas wrapper for 2D design editor.
 * Supports zone clipping, object add/move/rotate/scale, and sync with DesignStore.
 */

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, Rect, FabricText, FabricImage, Circle, Ellipse, Group, ActiveSelection, type FabricObject } from 'fabric';
import { useDesignStore } from '@/stores/designStore';
import { zoneToPixels } from '@/services/zoneClipManager';
import { getFirstZone, parseZoneBounds } from '@/services/CustomizationEngine';
import type { CustomizationSchema } from '@/services/CustomizationEngine';
import type { ZoneBounds } from '@/types/designEditor';
import { designToObjects, canvasToDesign } from '@/services/designSerializer';

const DEFAULT_ZONE: ZoneBounds = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };

export interface DesignCanvasProps {
  width: number;
  height: number;
  productId: string | null;
  schema: CustomizationSchema | null;
  onObjectsChange?: (objectCount: number) => void;
}

export interface DesignCanvasHandle {
  addText: (text: string, fontFamily?: string) => void;
  addImageFromUrl: (url: string) => Promise<void>;
  addShape: (shape: 'rect' | 'circle' | 'ellipse') => void;
  groupSelection: () => void;
  ungroupSelection: () => void;
  restoreFromStore: () => Promise<void>;
  getPreviewDataUrl: (format?: string) => string | null;
}

export const DesignCanvas = forwardRef<DesignCanvasHandle, DesignCanvasProps>(function DesignCanvas({
  width,
  height,
  productId,
  schema,
  onObjectsChange,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const zoneIdRef = useRef<string>('main');

  const {
    layers,
    zoneBounds,
    setLayers,
    addLayer,
    setSelectedLayer,
    pushHistory,
  } = useDesignStore();

  const skipRestoreRef = useRef(false);
  const syncStoreFromCanvasRef = useRef<() => void>(() => {});

  const syncStoreFromCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !productId) return;
    skipRestoreRef.current = true;
    const objs = canvas.getObjects();
    const zone = zoneBounds[zoneIdRef.current] ?? DEFAULT_ZONE;
    const doc = canvasToDesign(objs, productId, { [zoneIdRef.current]: zone }, zoneIdRef.current);
    setLayers(doc.layers);
    onObjectsChange?.(doc.layers.length);
  }, [productId, zoneBounds, setLayers, onObjectsChange]);

  syncStoreFromCanvasRef.current = syncStoreFromCanvas;

  // Resolve zone from schema
  useEffect(() => {
    if (!schema) return;
    const zone = getFirstZone(schema);
    if (zone) {
      const bounds = parseZoneBounds(zone);
      zoneIdRef.current = zone.id;
      useDesignStore.getState().setZoneBounds({ [zone.id]: bounds });
    }
  }, [schema]);

  // Init canvas
  useEffect(() => {
    if (!containerRef.current || width <= 0 || height <= 0) return;
    const el = document.createElement('canvas');
    el.width = width;
    el.height = height;
    el.style.width = '100%';
    el.style.height = '100%';
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);

    const canvas = new Canvas(el, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;

    // Apply zone clipping
    const zone = zoneBounds[zoneIdRef.current] ?? DEFAULT_ZONE;
    const zonePx = zoneToPixels(zone, width, height);
    const clipRect = new Rect({
      left: zonePx.x,
      top: zonePx.y,
      width: zonePx.w,
      height: zonePx.h,
      absolutePositioned: true,
      selectable: false,
      evented: false,
    });
    (canvas as Canvas & { clipPath?: FabricObject }).clipPath = clipRect;

    const handleSelection = () => {
      const active = canvas.getActiveObject();
      if (active) {
        const data = (active as FabricObject & { data?: { layerId?: string } }).data;
        if (data?.layerId) setSelectedLayer(data.layerId);
      } else {
        setSelectedLayer(null);
      }
    };

    let modifyTimeout: ReturnType<typeof setTimeout>;
    const handleModified = () => {
      pushHistory();
      clearTimeout(modifyTimeout);
      modifyTimeout = setTimeout(() => syncStoreFromCanvasRef.current?.(), 300);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedLayer(null));
    canvas.on('object:modified', handleModified);

    return () => {
      clearTimeout(modifyTimeout);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
      canvas.off('object:modified', handleModified);
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [width, height, zoneBounds, pushHistory, setSelectedLayer]);

  const restoreFromStore = useCallback(async () => {
    if (skipRestoreRef.current) {
      skipRestoreRef.current = false;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas || !productId) return;
    const doc = {
      productId,
      layers,
      zoneBounds,
      version: 1,
      configVersion: 2 as const,
    };
    const objs = await designToObjects(doc, zoneIdRef.current);
    canvas.clear();
    objs.forEach((o) => canvas.add(o));
    canvas.requestRenderAll();
  }, [productId, layers, zoneBounds]);

  // Add text
  const addText = useCallback(
    (text: string, fontFamily = 'Inter') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const zone = zoneBounds[zoneIdRef.current] ?? DEFAULT_ZONE;
      const zonePx = zoneToPixels(zone, width, height);
      const txt = new FabricText(text, {
        left: zonePx.x + zonePx.w / 2 - 50,
        top: zonePx.y + zonePx.h / 2 - 15,
        fontFamily,
        fontSize: 24,
        fill: '#000',
      });
      txt.set({ originX: 'center', originY: 'center' });
      const layerId = addLayer({
        type: 'text',
        fabricJson: txt.toObject() as unknown as Record<string, unknown>,
        zoneId: zoneIdRef.current,
        locked: false,
        visible: true,
      });
      (txt as FabricObject & { data?: object }).data = { layerId, effect: 'none' };
      canvas.add(txt);
      canvas.setActiveObject(txt);
      canvas.requestRenderAll();
      pushHistory();
      syncStoreFromCanvas();
    },
    [addLayer, zoneBounds, width, height, pushHistory, syncStoreFromCanvas]
  );

  // Add image from URL
  const addImageFromUrl = useCallback(
    async (url: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const img = await FabricImage.fromURL(url);
        const zone = zoneBounds[zoneIdRef.current] ?? DEFAULT_ZONE;
        const zonePx = zoneToPixels(zone, width, height);
        img.set({
          left: zonePx.x + (zonePx.w - (img.width ?? 100) * 0.5) / 2,
          top: zonePx.y + (zonePx.h - (img.height ?? 100) * 0.5) / 2,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        const layerId = addLayer({
          type: 'image',
          fabricJson: img.toObject() as unknown as Record<string, unknown>,
          zoneId: zoneIdRef.current,
          locked: false,
          visible: true,
        });
        (img as FabricObject & { data?: object }).data = { layerId, effect: 'none' };
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        pushHistory();
        syncStoreFromCanvas();
      } catch {
        // ignore load errors
      }
    },
    [addLayer, zoneBounds, width, height, pushHistory, syncStoreFromCanvas]
  );

  // Add shape
  const addShape = useCallback(
    (shape: 'rect' | 'circle' | 'ellipse') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const zone = zoneBounds[zoneIdRef.current] ?? DEFAULT_ZONE;
      const zonePx = zoneToPixels(zone, width, height);
      const cx = zonePx.x + zonePx.w / 2;
      const cy = zonePx.y + zonePx.h / 2;
      let obj: FabricObject;
      if (shape === 'rect') {
        obj = new Rect({ left: cx - 40, top: cy - 30, width: 80, height: 60, fill: '#3b82f6' });
      } else if (shape === 'circle') {
        obj = new Circle({ left: cx - 30, top: cy - 30, radius: 30, fill: '#10b981' });
      } else {
        obj = new Ellipse({ left: cx - 40, top: cy - 25, rx: 40, ry: 25, fill: '#f59e0b' });
      }
      obj.set({ originX: 'center', originY: 'center' });
      const layerId = addLayer({
        type: 'shape',
        fabricJson: obj.toObject() as unknown as Record<string, unknown>,
        zoneId: zoneIdRef.current,
        locked: false,
        visible: true,
      });
      (obj as FabricObject & { data?: object }).data = { layerId, effect: 'none' };
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
      pushHistory();
      syncStoreFromCanvas();
    },
    [addLayer, zoneBounds, width, height, pushHistory, syncStoreFromCanvas]
  );

  const groupSelection = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && active instanceof ActiveSelection && active.size() > 1) {
      const objects = active.getObjects();
      canvas.discardActiveObject();
      objects.forEach((obj: FabricObject) => canvas.remove(obj));
      const group = new Group(objects, { subTargetCheck: true, interactive: true });
      canvas.add(group);
      canvas.setActiveObject(group);
      pushHistory();
      syncStoreFromCanvas();
    }
  }, [pushHistory, syncStoreFromCanvas]);

  const ungroupSelection = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && active instanceof Group) {
      const objects = active.getObjects();
      canvas.remove(active);
      objects.forEach((obj: FabricObject) => canvas.add(obj));
      canvas.setActiveObject(objects[0]);
      if (objects.length > 1) {
        const sel = new ActiveSelection(objects, { canvas });
        canvas.setActiveObject(sel);
      }
      pushHistory();
      syncStoreFromCanvas();
    }
  }, [pushHistory, syncStoreFromCanvas]);

  const getPreviewDataUrl = useCallback((format?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    try {
      return canvas.toDataURL({ format: (format as 'png' | 'jpeg' | 'webp') || 'png', multiplier: 1 });
    } catch {
      return null;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    addText,
    addImageFromUrl,
    addShape,
    groupSelection,
    ungroupSelection,
    restoreFromStore,
    getPreviewDataUrl,
  }), [addText, addImageFromUrl, addShape, groupSelection, ungroupSelection, restoreFromStore, getPreviewDataUrl]);

  return (
    <div className="design-canvas-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 200 }} />
    </div>
  );
});
