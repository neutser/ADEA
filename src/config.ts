/**
 * Shared app configuration
 * In dev, use relative /api so Vite proxy forwards to backend. Otherwise use explicit URL.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');
