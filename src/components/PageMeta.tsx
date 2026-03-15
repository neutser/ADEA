import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string;
}

const SITE_NAME = 'Adea Crafts';
const DEFAULT_DESC =
  'Custom 3D Logo Signs & Laser Engraving for Businesses. Professional interior branding, LED acrylic signs, and custom signage.';

export function PageMeta({ title, description = DEFAULT_DESC, image }: PageMetaProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Custom Signs & Engraving`;
  const ogImage = image ?? 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=1200&q=80';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
