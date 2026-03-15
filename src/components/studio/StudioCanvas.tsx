/**
 * Central canvas — 2D vector / 3D preview with mode toggle.
 */

import { Suspense } from 'react';
import { useStudioStore } from '@/stores/studioStore';
import ThreeDProductPreview from '@/components/ThreeDProductPreview';
import { VectorCanvas2D } from './VectorCanvas2D';
import { ARPreview } from './ARPreview';

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
      <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
        <VectorCanvas2D />
      </div>
    );
  }

  if (canvasMode === '3d') {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400, background: 'var(--bg-color)', borderRadius: 12, overflow: 'hidden' }}>
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
    <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
      <ARPreview />
    </div>
  );
}
