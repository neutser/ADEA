/**
 * Material library — Wood, metal, acrylic, paper, leather.
 */

import { useStudioStore } from '@/stores/studioStore';
import { getMaterialsForMachine } from '@/data/materials';
import { Package } from 'lucide-react';

export function MaterialLibrary() {
  const { machineId, material, setMaterial } = useStudioStore();
  const materials = getMaterialsForMachine(machineId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-neon-blue)', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Package size={14} /> Materials
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {materials.map((m) => (
          <button
            key={m.id}
            onClick={() => setMaterial(material?.id === m.id ? null : m)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: material?.id === m.id ? 'rgba(0,240,255,0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${material?.id === m.id ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {m.color && (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: m.color,
                  border: '1px solid var(--border-color)',
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.thicknessMM}mm · {m.type}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
