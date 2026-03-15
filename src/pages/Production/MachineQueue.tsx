import React from 'react';
import { Zap, Clock, FileText, Play, Pause, AlertTriangle } from 'lucide-react';

const machines = [
  {
    name: 'xTool P2S (55W CO2)',
    status: 'Running',
    currentJob: 'ORD-1041 – LED Backlit Logo Cut',
    progress: 72,
    material: '5mm White Acrylic Sheet (600×400mm)',
    file: 'ord1041_logo_cut.svg',
    timeRemaining: '18 min',
    jobsQueued: 3,
  },
  {
    name: 'Silhouette Curio 2',
    status: 'Idle',
    currentJob: '—',
    progress: 0,
    material: '—',
    file: '—',
    timeRemaining: '—',
    jobsQueued: 1,
  },
];

const queue = [
  { id: 1, order: 'ORD-1042', task: 'Cut 3D Logo Layers (3 layers)', machine: 'xTool P2S', file: 'ord1042_layer1.svg', material: '8mm Clear Acrylic (600×400)', time: '45 min', priority: 'Rush' },
  { id: 2, order: 'ORD-1042', task: 'Engrave backing plate', machine: 'xTool P2S', file: 'ord1042_engrave.svg', material: '3mm Black Acrylic (600×400)', time: '22 min', priority: 'Rush' },
  { id: 3, order: 'ORD-1039', task: 'Cut wayfinding arrows set (5 pcs)', machine: 'xTool P2S', file: 'ord1039_arrows.dxf', material: '3mm Matte Black Acrylic (600×400)', time: '35 min', priority: 'Normal' },
  { id: 4, order: 'ORD-1040', task: 'Engrave oak menu text', machine: 'Silhouette Curio 2', file: 'ord1040_menu.svg', material: '6mm Natural Oak (A3 panel)', time: '15 min', priority: 'Normal' },
];

const MachineQueue: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">

        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-lg">Machine Job Queue</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live status for xTool P2S and Silhouette Curio 2 production machines.</p>
        </div>

        {/* Machine Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          {machines.map((machine, i) => (
            <div key={i} className="card glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Zap size={24} color={machine.status === 'Running' ? '#00ff88' : 'var(--text-secondary)'} />
                  <h3 style={{ fontWeight: 700, fontSize: '1.15rem' }}>{machine.name}</h3>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: machine.status === 'Running' ? '#00ff8822' : 'rgba(255,255,255,0.1)',
                  color: machine.status === 'Running' ? '#00ff88' : 'var(--text-secondary)',
                }}>
                  {machine.status === 'Running' ? <><Play size={12} style={{ display: 'inline', marginRight: '4px' }}/> ACTIVE</> : <><Pause size={12} style={{ display: 'inline', marginRight: '4px' }}/> IDLE</>}
                </span>
              </div>

              {machine.status === 'Running' && (
                <>
                  <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Current: <strong>{machine.currentJob}</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Material: {machine.material}</p>
                  <div style={{ background: 'var(--border-color)', borderRadius: '4px', height: '8px', marginBottom: '8px' }}>
                    <div style={{ width: `${machine.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-neon-blue), var(--accent-neon-purple))', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{machine.progress}% complete</span>
                    <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/>{machine.timeRemaining} remaining</span>
                  </div>
                </>
              )}

              <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jobs in queue: <strong>{machine.jobsQueued}</strong></p>
            </div>
          ))}
        </div>

        {/* Job Queue Table */}
        <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="heading-md" style={{ fontSize: '1.2rem' }}>Upcoming Jobs</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Order', 'Task', 'Machine', 'File', 'Material', 'Est. Time', 'Priority'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--accent-neon-blue)' }}>{job.order}</td>
                  <td style={{ padding: '14px 20px' }}>{job.task}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{job.machine}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-neon-purple)' }}><FileText size={14}/> {job.file}</span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.material}</td>
                  <td style={{ padding: '14px 20px' }}>{job.time}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {job.priority === 'Rush' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff4444' }}><AlertTriangle size={14}/> Rush</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MachineQueue;
