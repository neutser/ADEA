/**
 * MockupService — Client API for mockup generation.
 */

import { API_BASE } from '@/config';

export async function generateMockup(params: {
  designImage: string;
  productId: string;
  productImageUrl?: string;
  format?: 'png' | 'webp';
  width?: number;
}): Promise<Blob | { url: string }> {
  const res = await fetch(`${API_BASE}/api/mockup/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: params.productId,
      designImage: params.designImage,
      productImageUrl: params.productImageUrl,
      format: params.format || 'png',
      width: params.width || 600,
    }),
  });
  if (!res.ok) throw new Error('Mockup generation failed');
  const ct = res.headers.get('Content-Type') || '';
  if (ct.includes('image/')) return res.blob();
  const data = await res.json();
  return { url: data.url };
}
