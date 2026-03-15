import { ArrowRight, Star, CheckCircle, Sparkles, Image, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mainSections } from '@/data/navigation';
import HomeMiniConfigurator from '@/components/HomeMiniConfigurator';

const stagger = (i: number) => ({ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any });
const viewport = { once: true, margin: '-60px' };

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section – Animated entrance */}
      <section className="hero section" style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,20,0.9) 50%, rgba(10,10,10,0.85) 100%), url("https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Subtle animated overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,240,255,0.03) 50%, transparent 100%)',
          pointerEvents: 'none',
          animation: 'subtlePulse 6s ease-in-out infinite',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.h1
            className="heading-xl"
            style={{ marginBottom: '24px' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
          >
            Design Your Custom Products and<br />
            <span className="text-gradient-accent neon-text-blue">See Them Before You Buy</span>
          </motion.h1>
          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 40px' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Upload your logo or photo and preview signs, gifts, and apparel in real environments. No surprises—just confidence.
          </motion.p>
          <motion.div
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <Link to="/design" className="btn btn-primary" style={{ padding: '16px 28px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start Designing
            </Link>
            <Link to="/ai-builder" className="btn btn-outline" style={{ padding: '16px 28px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8, borderColor: 'var(--accent-neon-blue)', color: 'var(--accent-neon-blue)' }}>
              <Building2 size={20} /> Upload Your Building Photo
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ padding: '16px 28px', fontSize: '1.05rem' }}>
              Browse Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive AI Demo Section */}
      <section className="section bg-surface">
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '48px' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.5 }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Try the AI Configurator</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Upload a logo, pick a sign type, and see an instant preview. This is how we help you visualize before you buy.
            </p>
          </motion.div>
          <HomeMiniConfigurator />
        </div>
      </section>

      {/* 4 Main Categories – Staggered cards */}
      <section className="section bg-surface">
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '60px' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.5 }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Explore Our Catalog</h2>
            <p style={{ color: 'var(--text-secondary)' }}>120+ custom products across 8 categories. Design, personalize, and order.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Business Signs', desc: '3D logos, LED signs, office signage', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80', link: '/shop/business-signs', count: 20 },
              { title: 'Personalized Gifts', desc: 'Keychains, coasters, custom gifts', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', link: '/shop/personalized-gifts', count: 15 },
              { title: 'Clothing & Uniforms', desc: 'Embroidery, DTF, uniforms', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', link: '/shop/clothing-apparel', count: 15 },
              { title: 'Wedding & Events', desc: 'Welcome signs, favors, seating', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', link: '/shop/wedding', count: 15 },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={stagger(i)}
              >
                <Link to={cat.link} className="card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', textDecoration: 'none', height: '100%' }}>
                  <motion.div
                    style={{ height: '200px', borderRadius: '8px', overflow: 'hidden', background: `url(${cat.img}) center/cover` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div>
                    <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{cat.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>{cat.desc}</p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-neon-blue)', fontWeight: 600 }}>{cat.count} products</span>
                  </div>
                  <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-neon-blue)', fontWeight: 600 }} whileHover={{ x: 4 }}>
                    Shop <ArrowRight size={18} />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div style={{ textAlign: 'center', marginTop: '40px' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
            <Link to="/shop" className="btn btn-outline">View All 8 Categories</Link>
          </motion.div>
        </div>
      </section>

      {/* Browse All Sections */}
      <section className="section">
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '48px' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.5 }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Explore by Category</h2>
            <p style={{ color: 'var(--text-secondary)' }}>120 products: business signs, gifts, wedding, apparel, home decor, pets, events</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {mainSections.map((s, i) => (
              <motion.div
                key={s.path}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={stagger(i)}
                whileHover={{ y: -4 }}
              >
                <Link to={s.path} className="card glass-panel" style={{ padding: '24px', textDecoration: 'none', display: 'block', height: '100%' }}>
                  <h3 className="heading-md" style={{ fontSize: '1.2rem', marginBottom: 8 }}>{s.label}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 16 }}>{s.desc}</p>
                  <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent-neon-blue)', fontWeight: 600 }} whileHover={{ x: 4 }}>
                    Explore <ArrowRight size={16} />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div style={{ textAlign: 'center', marginTop: '40px' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
            <Link to="/ai-builder" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} /> Try AI Builder – Preview in Your Space
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works – Animated steps */}
      <section className="section">
        <div className="container">
          <motion.h2 className="heading-lg" style={{ textAlign: 'center', marginBottom: '60px' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport}>How It Works</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
            {[
              { step: '1', title: 'Upload Logo or Photo', desc: 'Upload your logo or choose from templates' },
              { step: '2', title: 'Customize Product', desc: 'Choose material, size, and options' },
              { step: '3', title: 'Preview in Real Scene', desc: 'See your sign in your building or room' },
              { step: '4', title: 'Order or Request Quote', desc: 'Fast checkout or get a custom quote' },
            ].map((step, i) => (
              <motion.div
                key={i}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={stagger(i)}
              >
                <motion.div
                  style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-neon-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-neon-blue)' }}
                  className="neon-box-blue"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 25px var(--accent-glow-blue)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section – Image hover zoom */}
      <section className="section" style={{ background: 'var(--bg-elevated)' }}>
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '48px' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.5 }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Real Installations</h2>
            <p style={{ color: 'var(--text-secondary)' }}>See our work in restaurants, offices, salons, and weddings.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Restaurant Logo Sign', img: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=600&q=80', link: '/shop/business-signs' },
              { title: 'Office Reception Sign', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80', link: '/shop/business-signs' },
              { title: 'Custom Wedding Sign', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', link: '/shop/wedding' },
              { title: 'Embroidered Uniforms', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', link: '/shop/clothing-apparel' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={stagger(i)}>
                <Link to={item.link} className="card glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                  <motion.div
                    style={{ height: '180px', background: `url(${item.img}) center/cover` }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div style={{ padding: '20px' }}>
                    <h3 className="heading-md" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{item.title}</h3>
                    <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-neon-blue)', fontWeight: 600, fontSize: '0.9rem' }} whileHover={{ x: 4 }}>
                      View products <ArrowRight size={14} />
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div style={{ textAlign: 'center', marginTop: '32px' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
            <Link to="/portfolio" className="btn btn-outline">View Full Portfolio</Link>
          </motion.div>
        </div>
      </section>

      {/* AI Preview Section – Animated border */}
      <section className="section">
        <div className="container">
          <motion.div
            className="card glass-panel"
            style={{ padding: '48px', overflow: 'hidden', position: 'relative', border: '1px solid var(--accent-neon-blue)', boxShadow: '0 0 30px rgba(0,240,255,0.1)' }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6 }}
            whileHover={{ boxShadow: '0 0 40px rgba(0,240,255,0.15)' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}>
                    <Image size={32} color="var(--accent-neon-blue)" />
                  </motion.div>
                  <h2 className="heading-lg" style={{ margin: 0, fontSize: '1.5rem' }}>See Your Sign Before You Buy</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                  Upload a photo of your building or room and preview your sign instantly. Our AI helps you place it, scale it, and compare materials—so you know exactly what you&apos;re getting.
                </p>
                <Link to="/ai-builder" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={20} /> Try AI Builder
                </Link>
              </div>
              <motion.div
                style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80") center/cover' }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Clients */}
      <section className="section" style={{ background: 'var(--bg-elevated)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <motion.div style={{ gap: '24px', display: 'flex', flexDirection: 'column' }} initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.6 }}>
              <h2 className="heading-lg">Trusted by Modern Businesses</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>We provide complete branding packages including reception logo signs, door signs, and directional signage for offices, restaurants, salons, and more.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Offices & Corporate Spaces', 'Restaurants & Cafes', 'Salons & Barbershops', 'Gyms & Fitness Centers'].map((client, i) => (
                  <motion.li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ delay: i * 0.1 }}>
                    <CheckCircle color="var(--accent-neon-purple)" /> {client}
                  </motion.li>
                ))}
              </ul>
              <Link to="/solutions" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>Explore Business Solutions</Link>
            </motion.div>
            <motion.div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.6 }}>
              <motion.img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" alt="Office sign" style={{ width: '100%', borderRadius: '12px' }} initial={{ y: 20, opacity: 0.8 }} whileInView={{ y: 0, opacity: 1 }} viewport={viewport} whileHover={{ y: -4 }} />
              <motion.img src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=400&q=80" alt="Restaurant sign" style={{ width: '100%', borderRadius: '12px' }} initial={{ y: -20, opacity: 0.8 }} whileInView={{ y: 0, opacity: 1 }} viewport={viewport} whileHover={{ y: -4 }} />
            </motion.div>
          </div>

          {/* Client Logos */}
          <motion.div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border-color)' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
            <h3 className="heading-md" style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>
              Trusted by businesses worldwide
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '40px', opacity: 0.8 }}>
              {['TechFlow Inc.', 'Elevate Salon', 'The Rustic Grill', 'Alpine Crossfit', 'Café Luz', 'Modern Barber'].map((name, i) => (
                <motion.div key={i} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }} whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.06)' }}>
                  {name}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div style={{ marginTop: '60px' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
            <h3 className="heading-md" style={{ textAlign: 'center', marginBottom: '40px' }}>What Our Clients Say</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {[
                { quote: "The LED acrylic sign completely transformed our salon's reception area. Premium quality and fast delivery!", name: "Sarah Jenkins", role: "Owner, Elevate Salon" },
                { quote: "Adea Crafts nailed our 3D company logo. It looks incredibly professional and adds so much authority to our new office space.", name: "Marcus Thorne", role: "CEO, TechFlow Inc." },
                { quote: "We ordered outdoor wayfinding signs and a massive illuminated logo for our restaurant. The attention to detail is unmatched.", name: "David Chen", role: "Manager, The Rustic Grill" },
              ].map((testi, i) => (
                <motion.div
                  key={i}
                  className="card glass-panel"
                  style={{ padding: '30px' }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={stagger(i)}
                  whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" style={{ marginRight: '4px' }} />)}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '24px' }}>&quot;{testi.quote}&quot;</p>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{testi.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{testi.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-color) 100%)' }}>
        <div className="container">
          <motion.div
            className="card glass-panel"
            style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '700px', margin: '0 auto', border: '1px solid var(--accent-neon-blue)' }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ boxShadow: '0 0 40px rgba(0,240,255,0.12)' }}
          >
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>Start Designing Your Product</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
              Upload your logo, preview in your space, and order with confidence.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/design" className="btn btn-primary" style={{ padding: '16px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} /> Start Designing
              </Link>
              <Link to="/ai-builder" className="btn btn-outline" style={{ padding: '16px 32px' }}>AI Builder</Link>
              <Link to="/shop" className="btn btn-outline" style={{ padding: '16px 32px' }}>Browse Shop</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
