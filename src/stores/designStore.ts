/**
 * Design Store — Zustand store for layer-based 2D design editor.
 * Manages layers, history, product context, and canvas sync.
 */

import { create } from 'zustand';
import type { DesignLayer, ZoneBounds } from '@/types/designEditor';

const MAX_HISTORY = 50;

export interface DesignStoreState {
  productId: string | null;
  productName: string;
  heroImage: string | null;
  zoneBounds: Record<string, ZoneBounds>;
  layers: DesignLayer[];
  selectedLayerId: string | null;
  past: DesignLayer[][];
  future: DesignLayer[][];
}

export interface DesignStoreActions {
  setProduct: (productId: string | null, productName: string, heroImage: string | null) => void;
  setZoneBounds: (bounds: Record<string, ZoneBounds>) => void;
  setLayers: (layers: DesignLayer[]) => void;
  addLayer: (layer: Omit<DesignLayer, 'id' | 'order'>) => string;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  reorderLayer: (id: string, newOrder: number) => void;
  duplicateLayer: (id: string) => string | null;
  setSelectedLayer: (id: string | null) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}

const initialState: DesignStoreState = {
  productId: null,
  productName: '',
  heroImage: null,
  zoneBounds: {},
  layers: [],
  selectedLayerId: null,
  past: [],
  future: [],
};

export const useDesignStore = create<DesignStoreState & DesignStoreActions>((set, get) => ({
  ...initialState,

  setProduct: (productId, productName, heroImage) =>
    set({ productId, productName, heroImage: heroImage || null }),

  setZoneBounds: (zoneBounds) => set({ zoneBounds }),

  setLayers: (layers) => set({ layers: [...layers] }),

  addLayer: (layer) => {
    const { layers } = get();
    const order = layers.length;
    const id = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newLayer: DesignLayer = {
      ...layer,
      id,
      order,
      zoneId: layer.zoneId || 'main',
    };
    set({ layers: [...layers, newLayer] });
    get().pushHistory();
    return id;
  },

  removeLayer: (id) => {
    set({
      layers: get().layers.filter((l) => l.id !== id),
      selectedLayerId: get().selectedLayerId === id ? null : get().selectedLayerId,
    });
    get().pushHistory();
  },

  updateLayer: (id, updates) => {
    set({
      layers: get().layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    });
  },

  reorderLayer: (id, newOrder) => {
    const layers = [...get().layers];
    const idx = layers.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const [removed] = layers.splice(idx, 1);
    const targetIdx = Math.max(0, Math.min(newOrder, layers.length));
    layers.splice(targetIdx, 0, removed);
    set({
      layers: layers.map((l, i) => ({ ...l, order: i })),
    });
    get().pushHistory();
  },

  duplicateLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id);
    if (!layer) return null;
    const { fabricJson, zoneId, locked, visible, type, effect, name } = layer;
    return get().addLayer({
      type,
      effect,
      fabricJson: JSON.parse(JSON.stringify(fabricJson)),
      zoneId,
      locked,
      visible,
      name: name ? `${name} (copy)` : undefined,
    });
  },

  setSelectedLayer: (selectedLayerId) => set({ selectedLayerId }),

  pushHistory: () => {
    const { layers, past } = get();
    const snapshot = JSON.parse(JSON.stringify(layers));
    const newPast = [...past.slice(-(MAX_HISTORY - 1)), snapshot];
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, future, layers } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      layers: prev,
      past: past.slice(0, -1),
      future: [JSON.parse(JSON.stringify(layers)), ...future],
    });
  },

  redo: () => {
    const { past, future, layers } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      layers: next,
      past: [...past, JSON.parse(JSON.stringify(layers))],
      future: future.slice(1),
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  reset: () => set(initialState),
}));
