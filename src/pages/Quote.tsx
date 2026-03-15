import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '@/config';

export interface QuoteDesignContext {
  productId: string;
  productName: string;
  config: Record<string, unknown>;
  quantity?: number;
  estimatedTotal?: number;
  sceneImage?: string;
}

const Quote: React.FC = () => {
  const location = useLocation();
  const fromDesign = (location.state as { fromDesign?: QuoteDesignContext })?.fromDesign;

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [referenceFile, setReferenceFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fromDesign) return;
    setMessage(prev => prev || `Quote request for: ${fromDesign.productName}\nQuantity: ${fromDesign.quantity ?? 1}\n${fromDesign.estimatedTotal ? `Estimated: $${fromDesign.estimatedTotal.toFixed(2)}\n` : ''}\n[Design configuration attached]`);
    if (fromDesign.config?.logo && typeof fromDesign.config.logo === 'string') {
      setReferenceFile(fromDesign.config.logo as string);
    } else if (fromDesign.sceneImage) {
      setReferenceFile(fromDesign.sceneImage);
    }
  }, [fromDesign?.productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setReferenceFile(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const designPayload: Record<string, unknown> = {
        businessName: businessName.trim() || undefined,
        referenceImage: referenceFile || undefined,
      };
      if (fromDesign) {
        designPayload.productId = fromDesign.productId;
        designPayload.productName = fromDesign.productName;
        designPayload.config = fromDesign.config;
        designPayload.quantity = fromDesign.quantity ?? 1;
        designPayload.estimatedTotal = fromDesign.estimatedTotal;
        designPayload.sceneImage = fromDesign.sceneImage;
      }
      const res = await fetch(`${API_BASE}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: designPayload,
          message: message.trim() || undefined,
          email: email.trim(),
          name: name.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit quote');
      await res.json();
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card glass-panel" style={{ textAlign: 'center', padding: 48 }}>
            <h2 className="heading-lg" style={{ marginBottom: 16, color: 'var(--accent-neon-blue)' }}>Quote Request Received</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Thank you for your interest. We'll get back to you within 24 hours with a custom quote.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We've sent a confirmation to {email}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="heading-lg" style={{ marginBottom: '20px', textAlign: 'center' }}>Request a Custom Quote</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px' }}>
          {fromDesign ? `Quote for your ${fromDesign.productName} design. We'll get back to you within 24 hours.` : "Describe your project and we'll get back to you within 24 hours."}
        </p>
        {fromDesign && (
          <div className="card glass-panel" style={{ marginBottom: 24, padding: 16, background: 'rgba(0,240,255,0.05)', border: '1px solid var(--accent-neon-blue)' }}>
            <strong style={{ color: 'var(--accent-neon-blue)' }}>Design attached:</strong> {fromDesign.productName}
            {fromDesign.estimatedTotal != null && (
              <span style={{ marginLeft: 12, color: 'var(--text-secondary)' }}>Est. ${fromDesign.estimatedTotal.toFixed(2)}</span>
            )}
          </div>
        )}

        <form
          className="card glass-panel"
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Business Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Acme Corp"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input
              type="email"
              className="input-field"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Project Description</label>
            <textarea
              className="input-field"
              rows={5}
              placeholder="Describe the signs you need, including dimensions and materials if known..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Upload Reference or Logo</label>
            <input
              type="file"
              className="input-field"
              style={{ padding: '10px' }}
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            {referenceFile && (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-neon-blue)', marginTop: 8 }}>File attached</p>
            )}
          </div>
          {error && (
            <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Quote;
