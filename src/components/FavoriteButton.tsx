import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface FavoriteButtonProps {
  targetType: 'product' | 'template' | 'storefront';
  targetId: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FavoriteButton({ targetType, targetId, size = 20, className, style }: FavoriteButtonProps) {
  const { token, isAuthenticated } = useAuth();
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetch(`${API_BASE}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const fav = (data.favorites || []).find((f: { target_type: string; target_id: string }) => f.target_type === targetType && f.target_id === targetId);
        setFavoriteId(fav?.id ?? null);
      });
  }, [isAuthenticated, token, targetType, targetId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !token) return;
    if (loading) return;
    setLoading(true);
    if (favoriteId) {
      fetch(`${API_BASE}/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => { if (r.ok) setFavoriteId(null); setLoading(false); }).catch(() => setLoading(false));
    } else {
      fetch(`${API_BASE}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetType, targetId }),
      })
        .then(r => r.json())
        .then(data => { setFavoriteId(data.id); setLoading(false); })
        .catch(() => setLoading(false));
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={className}
      style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 10, padding: 8, cursor: isAuthenticated ? 'pointer' : 'default', ...style }}
      title={isAuthenticated ? (favoriteId ? 'Remove from favorites' : 'Add to favorites') : 'Log in to save favorites'}
    >
      <Heart size={size} fill={favoriteId ? 'var(--accent-red)' : 'none'} color={favoriteId ? 'var(--accent-red)' : '#fff'} />
    </button>
  );
}
