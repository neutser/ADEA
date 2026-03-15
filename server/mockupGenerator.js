/**
 * Mockup Generator — Composite design onto product template.
 * POST /api/mockup/generate — returns PNG/WebP composite.
 * Uses node-canvas when available; otherwise returns product image URL.
 */

/**
 * Generate mockup image. Requires designImage (data URL) and productImageUrl.
 * @param {Object} opts
 * @param {string} opts.designImage - Data URL of rendered design
 * @param {string} opts.productImageUrl - URL of product hero/template
 * @param {string} [opts.format='png'] - 'png' | 'webp'
 * @param {number} [opts.width=600] - Output width
 * @returns {Promise<{ buffer?: Buffer; url?: string }>} Image buffer or fallback URL
 */
export async function generateMockup({ designImage, productImageUrl, format = 'png', width = 600 }) {
  try {
    const canvasMod = await import('canvas').catch(() => null);
    if (!canvasMod?.createCanvas) return { url: productImageUrl };
    const { createCanvas, loadImage } = canvasMod;
    const productImg = await loadImage(productImageUrl);
    const aspect = productImg.height / productImg.width;
    const h = Math.round(width * aspect);
    const canvas = createCanvas(width, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(productImg, 0, 0, width, h);

    if (designImage && designImage.startsWith('data:')) {
      const designImg = await loadImage(designImage);
      const zoneMargin = 0.15;
      const zoneX = width * zoneMargin;
      const zoneY = h * zoneMargin;
      const zoneW = width * (1 - 2 * zoneMargin);
      const zoneH = h * (1 - 2 * zoneMargin);
      ctx.drawImage(designImg, zoneX, zoneY, zoneW, zoneH);
    }

    const buffer = canvas.toBuffer(`image/${format}`, { compressionLevel: 6 });
    return { buffer };
  } catch (err) {
    return { url: productImageUrl };
  }
}
