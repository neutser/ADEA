import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '@/config';

const generateSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
};

export const trackEvent = (event: string, page: string, metadata?: Record<string, any>, productId?: string) => {
  try {
    fetch(`${API_BASE}/api/analytics`, {
      // #region agent log
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        page,
        metadata,
        productId,
        sessionId: generateSessionId()
      })
    }).catch(e => console.error('Analytics error:', e));
  } catch(e) { /* ignore */ }
};

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', location.pathname);
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
