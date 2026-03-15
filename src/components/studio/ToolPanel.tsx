/**
 * Tool panel for Crafting Studio — Emboss, Cut, Engrave, Sign.
 */

import { MousePointer2, Scissors, PenTool, Type, Layers } from 'lucide-react';
import { useStudioStore, type CraftTool } from '@/stores/studioStore';
import { MACHINE_PROFILES, getMachineProfile } from '@/services/machineProfiles';

const TOOLS: { id: CraftTool; label: string; icon: React.ReactNode }[] = [
  { id: 'select', label: 'Select', icon: <MousePointer2 size={18} /> },
  { id: 'emboss', label: 'Emboss', icon: <Layers size={18} /> },
  { id: 'cut', label: 'Cut', icon: <Scissors size={18} /> },
  { id: 'engrave', label: 'Engrave', icon: <PenTool size={18} /> },
  { id: 'sign', label: 'Sign', icon: <Type size={18} /> },
];

export function ToolPanel() {
  const { machineId, selectedTool, setTool, embossDepth, setEmbossDepth } = useStudioStore();
  const profile = getMachineProfile(machineId);
  const availableTools = profile?.capabilities ?? ['cut'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-neon-blue)', textTransform: 'uppercase', letterSpacing: 1 }}>
        Tools
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TOOLS.map((t) => {
          const enabled = t.id === 'select' || availableTools.includes(t.id as 'emboss' | 'cut' | 'engrave' | 'sign');
          return (
            <button
              key={t.id}
              onClick={() => enabled && setTool(t.id)}
              disabled={!enabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                background: selectedTool === t.id ? 'rgba(0,240,255,0.12)' : 'var(--bg-elevated)',
                border: `1px solid ${selectedTool === t.id ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
                color: enabled ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: enabled ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
                opacity: enabled ? 1 : 0.5,
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      {selectedTool === 'emboss' && (
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Depth: {embossDepth}mm
          </label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={embossDepth}
            onChange={(e) => setEmbossDepth(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Machine: {profile?.name ?? machineId}
      </div>
    </div>
  );
}
