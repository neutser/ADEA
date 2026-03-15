/**
 * AR Preview — marker-based AR using AR.js + A-Frame.
 * Loads ar-preview.html in an iframe for webcam AR.
 * Requires HTTPS or localhost for camera access.
 */

import { useRef, useEffect } from 'react';

export function ARPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // AR requires secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn('AR preview requires HTTPS or localhost for camera access');
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        position: 'relative',
        background: '#000',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <iframe
        ref={iframeRef}
        src="/ar-preview.html"
        title="AR Preview"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 400,
          border: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 8,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        Point your camera at the{' '}
        <a
          href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-neon-blue, #6cf)' }}
        >
          Hiro marker
        </a>{' '}
        to preview your craft in AR.
      </div>
    </div>
  );
}
