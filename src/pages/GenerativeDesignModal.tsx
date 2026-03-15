import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { API_BASE } from '@/config';

interface GenerativeDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (dataUrl: string) => void;
  productCategory?: string;
  style?: string;
}

export function GenerativeDesignModal({
  isOpen,
  onClose,
  onSelectImage,
  productCategory,
  style,
}: GenerativeDesignModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Array<{ b64: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const handleGenerate = async () => {
    const text = prompt.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setImages([]);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, productCategory, style }),
      });
      const data = await res.json();
      if (res.status === 503 && data.code === 'AI_UNAVAILABLE') {
        setUnavailable(true);
      } else if (res.ok && data.images?.length) {
        setImages(data.images);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (b64: string) => {
    const dataUrl = `data:image/png;base64,${b64}`;
    onSelectImage(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: 'min(480px, 95vw)',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
          borderRadius: 16,
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="var(--accent-neon-purple)" />
            Generate from prompt
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {unavailable ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add your OpenAI API key in .env to enable AI image generation.
          </p>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                className="input-field"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Minimalist logo with geometric shapes, navy and gold"
                disabled={loading}
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem' }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{ width: '100%', padding: 12, marginBottom: 20 }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(img.b64)}
                    style={{
                      padding: 0,
                      border: '2px solid var(--border-color)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--bg-elevated)',
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${img.b64}`}
                      alt={`Generated ${idx + 1}`}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
