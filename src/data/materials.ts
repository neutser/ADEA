/**
 * Material library for Curio 2 and xTool machines.
 */

import type { MachineId } from '@/services/machineProfiles';

export type MaterialType = 'wood' | 'metal' | 'acrylic' | 'paper' | 'leather' | 'cardstock';

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  thicknessMM: number;
  textureUrl?: string;
  roughness?: number;
  metalness?: number;
  compatibleMachines: MachineId[];
  color?: string;
  /** Base price per sheet/unit (USD) for cost estimator */
  basePrice?: number;
}

export const MATERIALS: Material[] = [
  { id: 'cardstock-1mm', name: 'Cardstock 1mm', type: 'cardstock', thicknessMM: 1, compatibleMachines: ['curio2'], roughness: 0.8, metalness: 0, basePrice: 2 },
  { id: 'cardstock-2mm', name: 'Cardstock 2mm', type: 'cardstock', thicknessMM: 2, compatibleMachines: ['curio2'], roughness: 0.8, metalness: 0, basePrice: 3 },
  { id: 'leather-2mm', name: 'Leather 2mm', type: 'leather', thicknessMM: 2, compatibleMachines: ['curio2', 'xtool-d1', 'xtool-m1'], roughness: 0.9, metalness: 0, basePrice: 12 },
  { id: 'paper-0.3mm', name: 'Paper 0.3mm', type: 'paper', thicknessMM: 0.3, compatibleMachines: ['curio2'], roughness: 0.7, metalness: 0, basePrice: 0.5 },
  { id: 'acrylic-3mm', name: 'Acrylic 3mm', type: 'acrylic', thicknessMM: 3, compatibleMachines: ['xtool-d1', 'xtool-m1'], roughness: 0.1, metalness: 0, color: '#ffffff', basePrice: 8 },
  { id: 'acrylic-3mm-black', name: 'Acrylic Black 3mm', type: 'acrylic', thicknessMM: 3, compatibleMachines: ['xtool-d1', 'xtool-m1'], roughness: 0.2, metalness: 0, color: '#1a1a1a', basePrice: 10 },
  { id: 'wood-3mm', name: 'Basswood 3mm', type: 'wood', thicknessMM: 3, compatibleMachines: ['xtool-d1', 'xtool-m1'], roughness: 0.85, metalness: 0, basePrice: 5 },
  { id: 'wood-6mm', name: 'Plywood 6mm', type: 'wood', thicknessMM: 6, compatibleMachines: ['xtool-d1', 'xtool-m1'], roughness: 0.8, metalness: 0, basePrice: 7 },
  { id: 'metal-brass', name: 'Brass Sheet', type: 'metal', thicknessMM: 0.5, compatibleMachines: ['xtool-m1'], roughness: 0.3, metalness: 0.9, basePrice: 18 },
];

export function getMaterialsForMachine(machineId: MachineId): Material[] {
  return MATERIALS.filter((m) => m.compatibleMachines.includes(machineId));
}
