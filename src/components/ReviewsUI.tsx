import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  author_name?: string;
  created_at?: string;
}

interface ReviewsUIProps {
  productId?: string;
  templateId?: string;
  storefrontId?: string;
  onSubmitted?: () => void;
}

export function StarRating({ value, size = 18, editable, onChange }: { value: number; size?: number; editable?: boolean; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const display = editable ? (hover || value) : value;
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          role={editable ? 'button' : undefined}
          tabIndex={editable ? 0 : undefined}
          onMouseEnter={() => editable && setHover(i)}
          onMouseLeave={() => editable && setHover(0)}
          onClick={() => editable && onChange?.(i)}
          onKeyDown={e => editable && (e.key === 'Enter' || e.key === ' ') && onChange?.(i)}
          style={{ cursor: editable ? 'pointer' : 'default' }}
        >
          <Star size={size} fill={i <= display ? 'var(--accent-amber)' : 'none'} color={i <= display ? 'var(--accent-amber)' : 'var(--text-muted)'} />
        </span>
      ))}
    </span>
  );
}

export function ReviewForm({ productId, templateId, storefrontId, onSubmitted }: ReviewsUIProps) {
  const { token, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setError('Please log in to submit a review.');
      return;
    }
    if (rating < 1) {
      setError('Please select a rating.');
      return;
    }
    setError('');
    setSubmitting(true);
    fetch(`${API_BASE}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: productId || null, templateId: templateId || null, storefrontId: storefrontId || null, rating, title, body }),
    })
      .then(r => {
        if (!r.ok) return r.json().then(d => { throw new Error(d.error || 'Failed to submit'); });
        setRating(0);
        setTitle('');
        setBody('');
        onSubmitted?.();
      })
      .catch(err => setError(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginTop: 16 }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Write a review</h3>
      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8, fontSize: '0.9rem' }}>Rating:</span>
        <StarRating value={rating} editable onChange={setRating} />
      </div>
      <input type="text" className="input-field" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 10, width: '100%' }} />
      <textarea className="input-field" placeholder="Your review..." value={body} onChange={e => setBody(e.target.value)} rows={3} style={{ width: '100%', resize: 'vertical', marginBottom: 12 }} />
      {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: 8 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
    </form>
  );
}

export function ReviewsList({ productId, templateId, storefrontId, refreshKey }: ReviewsUIProps & { refreshKey?: number }) {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myPendingReview, setMyPendingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (productId) params.set('productId', productId);
    if (templateId) params.set('templateId', templateId);
    if (storefrontId) params.set('storefrontId', storefrontId);
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch(`${API_BASE}/api/reviews?${params}`, { headers })
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews || []);
        setMyPendingReview(data.myPendingReview || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, templateId, storefrontId, refreshKey, token]);

  if (loading) return <div style={{ padding: 20, color: 'var(--text-muted)' }}>Loading reviews...</div>;
  if (reviews.length === 0 && !myPendingReview) return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first!</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {myPendingReview && (
        <div className="card" style={{ padding: 16, borderLeft: '4px solid var(--accent-amber)', background: 'rgba(245,158,11,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <StarRating value={myPendingReview.rating} size={14} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Your review</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>Pending approval</span>
          </div>
          {myPendingReview.title && <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{myPendingReview.title}</h4>}
          {myPendingReview.body && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{myPendingReview.body}</p>}
        </div>
      )}
      {reviews.map(r => (
        <div key={r.id} className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <StarRating value={r.rating} size={14} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.author_name || 'Anonymous'}</span>
            {r.created_at && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</span>}
          </div>
          {r.title && <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{r.title}</h4>}
          {r.body && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.body}</p>}
        </div>
      ))}
    </div>
  );
}
