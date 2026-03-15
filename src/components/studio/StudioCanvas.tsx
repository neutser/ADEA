/**
 * Central canvas — 2D vector / 3D preview with mode toggle.
 * AR and 3D views are lazy-loaded for performance.
 */

import { Suspense, lazy } from 'react';
import { useStudioStore } from '@/stores/studioStore';
import { VectorCanvas2D } from './VectorCanvas2D';

const ThreeDProductPreview = lazy(() => import('@/components/ThreeDProductPreview').then((m) => ({ default: m.default })));
const ARPreview = lazy(() => import('./ARPreview').then((m) => ({ default: m.ARPreview })));

export function StudioCanvas() {
  const { canvasMode, material, darkMode } = useStudioStore();
  const config = {
    text: 'Sample',
    material: material?.type || 'acrylic_black',
    width: 60,
    widthCm: 60,
    heightCm: 30,
  };

  if (canvasMode === '2d') {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400 }} role="region" aria-label="2D vector canvas">
        <VectorCanvas2D />
      </div>
    );
  }

  if (canvasMode === '3d') {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400, background: 'var(--bg-color)', borderRadius: 12, overflow: 'hidden' }} role="region" aria-label="3D preview">
        <Suspense
          fallback={
            <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          }
        >
          <ThreeDProductPreview
            config={config}
            productType="sign"
            materialFinish={material?.type || 'matte_black'}
            isNightMode={darkMode}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400 }} role="region" aria-label="AR preview">
      <Suspense
        fallback={
          <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-neon-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        }
      >
        <ARPreview />
      </Suspense>
    </div>
  );
}
