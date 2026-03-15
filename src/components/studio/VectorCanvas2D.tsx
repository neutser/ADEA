/**
 * 2D vector canvas — cutting/engraving path preview with weeding visualization.
 */

import { useStudioStore } from '@/stores/studioStore';

export function VectorCanvas2D() {
  const { layers, selectedTool } = useStudioStore();
  const visibleLayers = layers.filter((l) => l.visible).sort((a, b) => a.order - b.order);

  const getStrokeColor = (type: string) => {
    switch (type) {
      case 'cut': return '#0066ff';
      case 'score': return '#ff6600';
      case 'emboss': return '#00aa66';
      case 'engrave': return '#ff0000';
      default: return '#888';
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 203 305"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        <rect x="0" y="0" width="203" height="305" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="0.5" />
        {visibleLayers.length === 0 ? (
          <text x="101.5" y="152.5" textAnchor="middle" fill="var(--text-muted)" fontSize="12">
            Import SVG, PNG, or DXF
          </text>
        ) : (
          visibleLayers.map((layer) => (
            <g key={layer.id} opacity={layer.locked ? 0.6 : 1}>
              <path
                d={layer.paths || ''}
                fill="none"
                stroke={getStrokeColor(layer.type)}
                strokeWidth={layer.type === 'score' ? 0.3 : 0.5}
                strokeDasharray={selectedTool === 'cut' ? '4 2' : 'none'}
                style={{
                  animation: selectedTool === 'cut' ? 'dash 1s linear infinite' : 'none',
                }}
              />
            </g>
          ))
        )}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -6; }
        }
      `}</style>
    </div>
  );
}
