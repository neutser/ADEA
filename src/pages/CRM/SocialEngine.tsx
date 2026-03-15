import React, { useState } from 'react';
import { Search, Instagram, Facebook, RefreshCw, PlusCircle, CheckCircle } from 'lucide-react';

const SocialEngine: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState([
    { id: 1, handle: "@the_rustic_grill", platform: "Instagram", post: "Excited to re-open our updated dining room next month! renovations nearly complete! 🔨", date: "2 hrs ago", added: false },
    { id: 2, handle: "TechFlow Coworking", platform: "Facebook", post: "We just signed the lease on our massive new location in downtown Zurich!", date: "5 hrs ago", added: false },
    { id: 3, handle: "@elevatesalon_ch", platform: "Instagram", post: "Out with the old, in with the new. Rebranding announcement coming soon ✨", date: "1 day ago", added: true },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  const handleAdd = (id: number) => {
    setResults(results.map(r => r.id === id ? { ...r, added: true } : r));
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
           <h1 className="heading-lg" style={{ marginBottom: '16px' }}>Social Media Lead Engine</h1>
           <p style={{ color: 'var(--text-secondary)' }}>Monitor platforms for "renovation", "new location", and "rebranding" keywords to catch businesses needing new signage right at the source.</p>
        </div>

        <div className="card glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
             <div style={{ position: 'relative' }}>
               <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
               <input type="text" className="input-field" placeholder="Keywords: 'renovation', 'new shop', 'rebranding', etc." defaultValue="renovation, newly opened, rebranding" style={{ paddingLeft: '40px' }} />
             </div>
           </div>
           <button 
             className="btn btn-primary" 
             onClick={handleScan}
             disabled={isScanning}
             style={{ padding: '15px 32px', display: 'flex', justifyContent: 'center', gap: '8px', minWidth: '160px' }}
           >
             {isScanning ? (
               <><RefreshCw size={20} className="spin" /> Scanning...</>
             ) : (
               <><Search size={20} /> Run Engine</>
             )}
           </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {results.map((result) => (
             <div key={result.id} className="card glass-panel slide-up" style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: result.platform === 'Instagram' ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {result.platform === 'Instagram' ? <Instagram size={24} /> : <Facebook size={24} />}
                </div>

                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{result.handle}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{result.date}</span>
                   </div>
                   <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>"{result.post}"</p>
                </div>

                <div>
                   <button 
                     className={`btn ${result.added ? 'btn-outline' : 'btn-primary'}`} 
                     style={{ padding: '10px 16px', display: 'flex', gap: '8px', opacity: result.added ? 0.7 : 1 }}
                     onClick={() => handleAdd(result.id)}
                     disabled={result.added}
                   >
                     {result.added ? <><CheckCircle size={18} /> Added to CRM</> : <><PlusCircle size={18}/> Capture Lead</>}
                   </button>
                </div>

             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default SocialEngine;
