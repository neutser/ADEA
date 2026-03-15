import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Search, Share2, Mail, Gift, Factory, Zap, Box, FileText, MessageSquare, Package } from 'lucide-react';

const CRMLayout: React.FC = () => {
  const crmItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Lead Pipeline', path: '/admin/pipeline', icon: <Users size={20} /> },
    { name: 'Directory Finder', path: '/admin/finder', icon: <Search size={20} /> },
    { name: 'Social Engine', path: '/admin/social', icon: <Share2 size={20} /> },
    { name: 'Outreach & Mockups', path: '/admin/outreach', icon: <Mail size={20} /> },
    { name: 'Referral Hub', path: '/admin/referrals', icon: <Gift size={20} /> },
    { name: 'Quote Management', path: '/admin/quotes', icon: <MessageSquare size={20} /> },
  ];

  const productionItems = [
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Production Pipeline', path: '/admin/pipeline-workflow', icon: <Factory size={20} /> },
    { name: 'Machine Queue', path: '/admin/machine-queue', icon: <Zap size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Box size={20} /> },
    { name: 'File Generator', path: '/admin/file-generator', icon: <FileText size={20} /> },
    { name: 'Craft Batch Sync', path: '/admin/craft-production', icon: <Gift size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: 'var(--bg-elevated)', borderRight: '1px solid var(--border-color)', padding: '24px' }}>
         <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {crmItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-neon-blue)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {item.icon} {item.name}
              </NavLink>
            ))}
         </nav>
         
         <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff9900', marginBottom: '16px' }}>Manufacturing</h2>
         <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {productionItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(255, 153, 0, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #ff9900' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {item.icon} {item.name}
              </NavLink>
            ))}
         </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default CRMLayout;
