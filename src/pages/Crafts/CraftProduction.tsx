import React, { useState } from 'react';
import { Download, CheckCircle2, Link as LinkIcon, RefreshCw, ShoppingCart, Layers } from 'lucide-react';

const marketplaceOrders = [
  { id: 'ETY-9921', source: 'Etsy', product: 'Wooden Heart Keychain', qty: 15, options: 'Various Names (See CSV)', date: '10 min ago', status: 'Pending Import', amount: '$115.00' },
  { id: 'SHP-4042', source: 'Shopify', product: 'Acrylic Pet Tag', qty: 1, options: '"Bella" + Paw Icon', date: '45 min ago', status: 'Imported', amount: '$14.99' },
  { id: 'TIK-1102', source: 'TikTok Shop', product: 'Custom Phone Stand', qty: 2, options: 'Walnut Finish', date: '2 hrs ago', status: 'Imported', amount: '$38.00' },
];

const batchJobs = [
  { id: 'BATCH-A', material: 'Birch Wood (3mm)', items: 42, type: 'Keychains & Coasters', estTime: '45 min', machine: 'xTool P2S' },
  { id: 'BATCH-B', material: 'Clear Acrylic (3mm)', items: 15, type: 'Pet Tags', estTime: '18 min', machine: 'Silhouette Curio 2' },
];

const CraftProduction: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="heading-lg">Craft Production Engine</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage B2C marketplace orders and batch cutting layouts.</p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ display: 'flex', gap: '8px', opacity: syncing ? 0.7 : 1 }}
            onClick={handleSync}
            disabled={syncing}
          >
             <RefreshCw size={18} className={syncing ? 'spin' : ''} /> 
             {syncing ? 'Syncing...' : 'Sync Marketplaces'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          
          {/* Incoming Orders Stream */}
          <div>
            <h2 className="heading-md" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <ShoppingCart size={20} color="var(--accent-neon-blue)"/> Marketplace Incoming Stream
            </h2>
            <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
               {marketplaceOrders.map((order, i) => (
                 <div key={i} style={{ padding: '20px', borderBottom: i < marketplaceOrders.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem',
                        background: order.source === 'Etsy' ? '#eb6d2033' : order.source === 'Shopify' ? '#95bf4733' : '#ff005033',
                        color: order.source === 'Etsy' ? '#eb6d20' : order.source === 'Shopify' ? '#95bf47' : '#ff0050' 
                      }}>
                         {order.source[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{order.id}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{order.qty} items</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{order.product} — {order.options}</p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                       <p style={{ fontWeight: 600, marginBottom: '4px' }}>{order.amount}</p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', fontSize: '0.8rem', color: order.status === 'Imported' ? '#00ff88' : '#ff9900' }}>
                          {order.status === 'Imported' ? <CheckCircle2 size={14} /> : <Download size={14} />} {order.status}
                       </div>
                    </div>

                 </div>
               ))}
            </div>
          </div>

          {/* Batch Nesting Generator */}
          <div>
            <h2 className="heading-md" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Layers size={20} color="var(--accent-neon-purple)"/> Batch Layouts
            </h2>
            
            <div className="card glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                 <p style={{ fontWeight: 600 }}>Auto-Nesting Engine</p>
                 <span style={{ color: '#00ff88', fontSize: '0.85rem' }}>57 items queued</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                 Optimize material usage by letting the AI nest small craft items onto standard 600×400mm sheets.
               </p>
               <button className="btn btn-outline" style={{ width: '100%', padding: '12px' }}>Generate Optimized Sheets</button>
            </div>

            <h3 className="heading-md" style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Ready for Machines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {batchJobs.map((job, i) => (
                 <div key={i} className="card glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span style={{ fontWeight: 600, color: 'var(--accent-neon-blue)' }}>{job.id}</span>
                       <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.estTime}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Material: {job.material}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Includes {job.items} {job.type}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                       <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{job.machine}</span>
                       <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px' }}><LinkIcon size={14}/> Push to Queue</button>
                    </div>
                 </div>
               ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CraftProduction;
