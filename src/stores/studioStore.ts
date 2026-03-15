/**
 * Zustand store for Crafting Studio state.
 * Handles layers, selected tool, material, undo/redo.
 */

import { create } from 'zustand';
import type { MachineId } from '@/services/machineProfiles';
import type { Material } from '@/data/materials';

export type CraftTool = 'emboss' | 'cut' | 'engrave' | 'sign' | 'select';
export type CanvasMode = '2d' | '3d' | 'ar';

export interface DesignLayer {
  id: string;
  type: 'cut' | 'score' | 'emboss' | 'engrave';
  name: string;
  paths: string;
  visible: boolean;
  locked: boolean;
  order: number;
}

export interface StudioState {
  machineId: MachineId;
  selectedTool: CraftTool;
  canvasMode: CanvasMode;
  material: Material | null;
  layers: DesignLayer[];
  embossDepth: number;
  darkMode: boolean;
  // Undo/redo
  past: DesignLayer[][];
  future: DesignLayer[][];
}

const MAX_HISTORY = 50;

export const useStudioStore = create<StudioState & {
  setMachine: (id: MachineId) => void;
  setTool: (tool: CraftTool) => void;
  setCanvasMode: (mode: CanvasMode) => void;
  setMaterial: (m: Material | null) => void;
  setEmbossDepth: (d: number) => void;
  setDarkMode: (v: boolean) => void;
  addLayer: (layer: Omit<DesignLayer, 'id' | 'order'>) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  reorderLayers: (from: number, to: number) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}>((set, get) => ({
  machineId: 'curio2',
  selectedTool: 'select',
  canvasMode: '2d',
  material: null,
  layers: [],
  embossDepth: 1,
  darkMode: true,
  past: [],
  future: [],

  setMachine: (id) => set({ machineId: id }),
  setTool: (tool) => set({ selectedTool: tool }),
  setCanvasMode: (mode) => set({ canvasMode: mode }),
  setMaterial: (m) => set({ material: m }),
  setEmbossDepth: (d) => set({ embossDepth: Math.max(0.5, Math.min(3, d)) }),
  setDarkMode: (v) => set({ darkMode: v }),

  addLayer: (layer) => {
    const layers = [...get().layers];
    const order = layers.length;
    const id = `layer-${Date.now()}`;
    layers.push({ ...layer, id, order });
    set({ layers });
    get().pushHistory();
  },

  removeLayer: (id) => {
    set({ layers: get().layers.filter((l) => l.id !== id) });
    get().pushHistory();
  },

  updateLayer: (id, updates) => {
    set({
      layers: get().layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    });
  },

  reorderLayers: (from, to) => {
    const layers = [...get().layers];
    const [removed] = layers.splice(from, 1);
    layers.splice(to, 0, removed);
    set({ layers: layers.map((l, i) => ({ ...l, order: i })) });
    get().pushHistory();
  },

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
}));
