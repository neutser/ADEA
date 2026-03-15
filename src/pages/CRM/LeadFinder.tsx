import React, { useState } from 'react';
import { Search, MapPin, AlertCircle, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

const mockLeads = [
  { id: 1, name: "The Modern Barber", category: "Barbershop", city: "Bern", status: "No Signage Detected", trust: "High", website: "modernbarber-bern.ch", date: "Just now" },
  { id: 2, name: "Café Luz", category: "Restaurant", city: "Zurich", status: "Outdated Sign", trust: "Medium", website: "cafeluz-zh.ch", date: "2 hrs ago" },
  { id: 3, name: "TechHub Coworking", category: "Office", city: "Basel", status: "No Interior Branding", trust: "High", website: "techhub-basel.com", date: "5 hrs ago" },
  { id: 4, name: "Glow Beauty Lounge", category: "Salon", city: "Geneva", status: "New Business Registration", trust: "Very High", website: "glowlounge.ge", date: "1 day ago" },
  { id: 5, name: "Alpine Crossfit", category: "Gym", city: "Zurich", status: "Faded Exterior Sign", trust: "Medium", website: "alpinecrossfit.ch", date: "1 day ago" },
];

const LeadFinder: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedLeads, setScannedLeads] = useState<typeof mockLeads>([]);

  const handleScan = () => {
    setIsScanning(true);
    setScannedLeads([]);
    setTimeout(() => {
      setScannedLeads(mockLeads);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="heading-lg">Directory Lead Finder</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Scan public directories and map data for signage opportunities.</p>
          </div>
          <div className="card glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span className="neon-text-blue" style={{ fontWeight: 600 }}>API Credits:</span> 1,240
          </div>
        </div>

        {/* Scan Controls */}
        <div className="card glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">City / Region</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
                  <input type="text" className="input-field" placeholder="e.g. Zurich" defaultValue="Zurich" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Business Category</label>
                <select className="input-field" style={{ appearance: 'none' }}>
                  <option>All Categories</option>
                  <option>Restaurants & Cafes</option>
                  <option>Barbershops & Salons</option>
                  <option>Offices & Coworking</option>
                  <option>Gyms & Fitness</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Opportunity Filter</label>
                <select className="input-field" style={{ appearance: 'none' }}>
                  <option>High Potential (Missing/Old Signs)</option>
                  <option>New Registrations (Last 30 Days)</option>
                  <option>All Local Businesses</option>
                </select>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleScan}
                disabled={isScanning}
                style={{ padding: '15px', display: 'flex', justifyContent: 'center', gap: '8px' }}
              >
                {isScanning ? (
                  <>Scanning Directories...</>
                ) : (
                  <><Search size={20} /> Start Deep Scan</>
                )}
              </button>
           </div>
        </div>

        {/* Results */}
        {scannedLeads.length > 0 && (
          <div className="slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="heading-md">Scan Results ({scannedLeads.length} Opportunities found)</h2>
              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Select All</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {scannedLeads.map((lead) => (
                <div key={lead.id} className="card glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--accent-neon-blue)' }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{lead.name}</h3>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>{lead.category}</span>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}><MapPin size={12}/> {lead.city}</span>
                    </div>
                    <a href="#" style={{ color: 'var(--accent-neon-blue)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {lead.website} <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Detector Flag:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: lead.trust.includes('High') ? '#00ff88' : '#ff9900' }}>
                       {lead.trust.includes('High') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                       <span style={{ fontWeight: 500 }}>{lead.status}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                       <ImageIcon size={16} /> Auto-Mockup
                    </button>
                    <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                       Add to CRM
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {isScanning && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
             <Search size={48} className="spin" style={{ margin: '0 auto 20px', opacity: 0.5, animation: 'spin 2s linear infinite' }} />
             <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
             <p className="heading-md">Analyzing Local Business Data...</p>
             <p>Scraping Map APIs, social profiles, and visible storefront images.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeadFinder;
