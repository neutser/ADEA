/**
 * Cost estimator for Crafting Studio.
 * Material base + machine-time factor based on layer count.
 */

import { useStudioStore } from '@/stores/studioStore';

const MACHINE_TIME_PER_LAYER = 0.5; // USD per layer (cut/engrave/emboss)
const BASE_LABOR = 5;

export function CostEstimator() {
  const { material, layers } = useStudioStore();

  const materialCost = material?.basePrice ?? 0;
  const layerCost = layers.length * MACHINE_TIME_PER_LAYER;
  const estimated = materialCost + layerCost + BASE_LABOR;

  return (
    <div
      style={{
        padding: 12,
        background: 'var(--bg-elevated)',
        borderRadius: 8,
        border: '1px solid var(--border-color)',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>Est. cost</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-neon-blue)' }}>
        ${estimated.toFixed(2)}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
        {material ? `${material.name} + ${layers.length} layers + labor` : 'Select material'}
      </div>
    </div>
  );
}
