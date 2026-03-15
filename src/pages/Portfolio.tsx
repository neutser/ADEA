import React from 'react';

const projects = [
  {
    title: 'Elevate Barbershop Branding',
    desc: 'Complete interior overhaul replacing a blank wall with a custom glowing neon-style LED logo and directional acrylic signage.',
    materials: 'LED Backlit Acrylic, Matte Black Perspex',
    before: 'https://images.unsplash.com/photo-1595922338276-8cc4821a37c9?w=600&q=80', // generic empty wall
    after: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80', // neon sign
  },
  {
    title: 'TechFlow Inc. Reception Wall',
    desc: 'Transformed an empty corporate reception desk into a premium branded entry point using precise 3D layered acrylic letters.',
    materials: 'Layered 3D Acrylic (White & Neon Blue)',
    before: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80', // empty office
    after: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80', // 3d logo office
  },
  {
    title: 'The Rustic Grill Exterior Sign',
    desc: 'Upgraded a fading painted wooden sign to a modern, durable natural wood and acrylic hybrid panel for this restaurant.',
    materials: 'Natural Oak Wood, Solid White Acrylic',
    before: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', // generic restaurant facade
    after: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=600&q=80', // nice lit restaurant sign
  }
];

const Portfolio: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="heading-lg" style={{ marginBottom: '20px' }}>Our Portfolio</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore our past projects including logo walls, barbershop signs, and restaurant branding.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
           {projects.map((project, i) => (
             <div key={i} className="card glass-panel slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>BEFORE</div>
                    <img src={project.before} alt="Before" style={{ width: '100%', height: '350px', objectFit: 'cover', filter: 'grayscale(100%) opacity(0.7)' }} />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--accent-neon-blue)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>AFTER</div>
                    <img src={project.after} alt="After" style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
                  </div>

                </div>
                
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="heading-md" style={{ fontSize: '1.5rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '800px' }}>{project.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-blue)', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Materials Used:</span> {project.materials}
                  </div>
                </div>
             </div>
           ))}
        </div>
        
      </div>
    </div>
  );
};

export default Portfolio;
