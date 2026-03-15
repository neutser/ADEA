/**
 * Crafting Studio — AI-powered preview for Curio 2 and xTool.
 * Layout: left tool panel, center canvas, right AI sidebar.
 */

import { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles, Undo, Redo, Download, Moon, Sun, Upload,
  Box, LayoutGrid, Video, ShoppingCart, Package,
} from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';
import { useStudioStore } from '@/stores/studioStore';
import { MACHINE_PROFILES } from '@/services/machineProfiles';
import { ToolPanel } from '@/components/studio/ToolPanel';
import { MaterialLibrary } from '@/components/studio/MaterialLibrary';
import { LayerPanel } from '@/components/studio/LayerPanel';
import { CostEstimator } from '@/components/studio/CostEstimator';
import { AIChatSidebar } from '@/components/studio/AIChatSidebar';
import { StudioCanvas } from '@/components/studio/StudioCanvas';
import { API_BASE } from '@/config';
import { useStudioSocket } from '@/hooks/useStudioSocket';

export default function CraftingStudio() {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  const {
    machineId,
    setMachine,
    canvasMode,
    setCanvasMode,
    darkMode,
    setDarkMode,
    undo,
    redo,
    past,
    future,
    layers,
    addLayer,
  } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useStudioSocket(designId, (delta) => {
    if (delta && typeof delta === 'object' && 'layers' in delta) {
      useStudioStore.setState({ layers: (delta as { layers: typeof layers }).layers });
    }
  });

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (file.name.endsWith('.svg') && result.includes('<svg')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        paths.forEach((p, i) => {
          addLayer({
            type: 'cut',
            name: `Layer ${i + 1}`,
            paths: p.getAttribute('d') || '',
            visible: true,
            locked: false,
          });
        });
        if (paths.length === 0) {
          addLayer({ type: 'cut', name: 'Imported', paths: '', visible: true, locked: false });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <PageMeta title="Crafting Studio — Curio 2 & xTool" description="AI-powered design studio for Silhouette Curio 2 and xTool machines." />

      {/* Top bar */}
      <div style={{ height: 64, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sparkles size={22} color="var(--accent-neon-blue)" />
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Crafting Studio</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>|</span>
          <select
            value={machineId}
            onChange={(e) => setMachine(e.target.value as any)}
            className="input-field"
            style={{ width: 180, padding: '8px 12px', fontSize: '0.9rem' }}
          >
            {MACHINE_PROFILES.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title={darkMode ? 'Light mode' : 'Dark mode'}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/marketplace" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={16} /> Shop Materials
          </Link>
          <Link to="/cart" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingCart size={16} /> Cart
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Left panel */}
        <div style={{ borderRight: '1px solid var(--border-color)', padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ToolPanel />
          <MaterialLibrary />
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-outline"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px' }}
            >
              <Upload size={16} /> Import SVG / PNG / DXF
            </button>
            <input ref={fileInputRef} type="file" accept=".svg,.png,.jpg,.jpeg,.dxf" style={{ display: 'none' }} onChange={handleFileImport} />
          </div>
        </div>

        {/* Center canvas */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setCanvasMode('2d')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: canvasMode === '2d' ? 'rgba(0,240,255,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${canvasMode === '2d' ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
              }}
            >
              <LayoutGrid size={16} /> 2D
            </button>
            <button
              onClick={() => setCanvasMode('3d')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: canvasMode === '3d' ? 'rgba(0,240,255,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${canvasMode === '3d' ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
              }}
            >
              <Box size={16} /> 3D
            </button>
            <button
              onClick={() => setCanvasMode('ar')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: canvasMode === 'ar' ? 'rgba(0,240,255,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${canvasMode === 'ar' ? 'var(--accent-neon-blue)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
              }}
            >
              <Video size={16} /> AR
            </button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <StudioCanvas />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <button onClick={undo} disabled={past.length === 0} className="btn btn-outline" style={{ padding: '8px 12px' }}>
              <Undo size={16} style={{ marginRight: 4 }} /> Undo
            </button>
            <button onClick={redo} disabled={future.length === 0} className="btn btn-outline" style={{ padding: '8px 12px' }}>
              <Redo size={16} style={{ marginRight: 4 }} /> Redo
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Layers: {layers.length}</span>
            <button
              onClick={async () => {
                const design = { layers: layers.map((l) => ({ type: l.type, name: l.name, paths: l.paths })) };
                const res = await fetch(`${API_BASE}/api/crafting-studio/export`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ machine: machineId, design }),
                });
                const blob = await res.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = machineId === 'curio2' ? 'design-curio.svg' : 'design-xtool.svg';
                a.click();
                URL.revokeObjectURL(a.href);
              }}
              className="btn btn-outline"
              style={{ padding: '8px 12px', marginLeft: 'auto' }}
            >
              <Download size={16} style={{ marginRight: 4 }} /> Export
            </button>
          </div>
        </div>

        {/* Right AI sidebar */}
        <div style={{ borderLeft: '1px solid var(--border-color)', padding: 20, overflowY: 'auto' }}>
          <AIChatSidebar />
          <div style={{ marginTop: 24 }}>
            <CostEstimator />
          </div>
          <div style={{ marginTop: 16 }}>
            <LayerPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
