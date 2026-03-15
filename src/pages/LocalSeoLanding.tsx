import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

// Mock database for local SEO generation
const seoData: Record<string, { city: string, category: string, img: string, desc: string }> = {
  'zurich-restaurants': {
    city: 'Zurich',
    category: 'Restaurants',
    img: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=1920&q=80',
    desc: 'Enhance your dining experience with custom illuminated interior branding and durable exterior signage built for Zurich’s culinary scene.'
  },
  'bern-barbershops': {
    city: 'Bern',
    category: 'Barbershops & Salons',
    img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1920&q=80',
    desc: 'Stand out on the street with eye-catching neon-style LED acrylic signs and custom interior branding specially designed for Bern salons.'
  },
  'default': {
    city: 'Your City',
    category: 'Businesses',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    desc: 'Professional interior branding and custom signage made with precision laser technology for modern businesses.'
  }
};

const LocalSeoLanding: React.FC = () => {
  const { city, category } = useParams<{ city: string; category: string }>();
  
  // Create a slug to match our mock db, or fallback to default
  const slug = `${city?.toLowerCase()}-${category?.toLowerCase()}`;
  const pageData = seoData[slug] || {
    city: city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Your City',
    category: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Businesses',
    img: seoData.default.img,
    desc: seoData.default.desc
  };

  const metaTitle = `Custom Signs for ${pageData.category} in ${pageData.city}`;
  const metaDesc = `${pageData.desc} Fast local production and targeted branding solutions.`;

  return (
    <div className="home-page">
      <PageMeta title={metaTitle} description={metaDesc} image={pageData.img} />
      {/* Dynamic Local Hero */}
      <section className="hero section" style={{ 
        position: 'relative', 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.9)), url("${pageData.img}") center/cover no-repeat`,
        textAlign: 'center'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '24px', marginBottom: '24px', fontStyle: 'italic' }}>
             <MapPin size={16} color="var(--accent-neon-blue)" /> Local {pageData.city} Provider
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '24px' }}>
            Custom Signs for<br />
            <span className="text-gradient-accent neon-text-blue">{pageData.category}</span> in {pageData.city}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px' }}>
            {pageData.desc} Fast local production and targeted branding solutions.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/marketplace/configure" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Design Your Sign Online
            </Link>
          </div>
        </div>
      </section>

      {/* Local Projects/Trust Section */}
      <section className="section bg-surface">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Trusted by {pageData.city} Businesses</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '60px' }}>Join the dozens of {pageData.category.toLowerCase()} that have elevated their brand with Adea Crafts.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[1,2,3].map((item) => (
               <div key={item} className="card glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
                  <div style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px' }}>
                     {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" style={{ marginRight: '4px' }} />)}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '24px' }}>
                    "The custom signage completely transformed our {pageData.category.substring(0, pageData.category.length-1).toLowerCase() || 'business'}. The local team was incredibly fast and the quality is exceptional."
                  </p>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>Local Business Owner</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pageData.city}, Switzerland</p>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LocalSeoLanding;
