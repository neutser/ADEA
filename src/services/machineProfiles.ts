/**
 * Machine profiles for Silhouette Curio 2 and xTool laser cutters/engravers.
 */

export type MachineId = 'curio2' | 'xtool-d1' | 'xtool-m1';
export type Capability = 'emboss' | 'cut' | 'engrave' | 'sign' | 'score';
export type ExportFormat = 'studio' | 'lightburn' | 'dxf' | 'svg';

export interface MachineProfile {
  id: MachineId;
  name: string;
  capabilities: Capability[];
  bedSizeMM: [number, number];
  exportFormats: ExportFormat[];
  materialThicknessRange: [number, number];
  dualCarriage?: boolean;
  description?: string;
}

export const MACHINE_PROFILES: MachineProfile[] = [
  {
    id: 'curio2',
    name: 'Silhouette Curio 2',
    capabilities: ['emboss', 'cut', 'score'],
    bedSizeMM: [203, 305],
    exportFormats: ['svg', 'studio'],
    materialThicknessRange: [0.1, 3],
    dualCarriage: true,
    description: 'Dual carriage for multi-tool operations. Embossing, cutting, scoring on paper, cardstock, leather.',
  },
  {
    id: 'xtool-d1',
    name: 'xTool D1',
    capabilities: ['cut', 'engrave', 'sign'],
    bedSizeMM: [406, 432],
    exportFormats: ['lightburn', 'dxf', 'svg'],
    materialThicknessRange: [0.5, 20],
    description: 'Diode laser for wood, acrylic, leather. Cutting and engraving.',
  },
  {
    id: 'xtool-m1',
    name: 'xTool M1',
    capabilities: ['cut', 'engrave', 'sign'],
    bedSizeMM: [406, 432],
    exportFormats: ['lightburn', 'dxf', 'svg'],
    materialThicknessRange: [0.5, 25],
    description: '10W laser for faster cutting. Wood, acrylic, metal engraving.',
  },
];

export function getMachineProfile(id: MachineId): MachineProfile | undefined {
  return MACHINE_PROFILES.find((m) => m.id === id);
}

export function getMachinesForCapability(cap: Capability): MachineProfile[] {
  return MACHINE_PROFILES.filter((m) => m.capabilities.includes(cap));
}
