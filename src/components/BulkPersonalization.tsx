import { useState, useMemo } from 'react';
import { Upload, Table, Eye, Download, AlertCircle, Check, FileText } from 'lucide-react';

interface BulkRow {
  [key: string]: string;
}

interface Props {
  variableFields: Array<{ id: string; label: string }>;
  onGenerate: (rows: BulkRow[]) => void;
}

/**
 * BulkPersonalization — CSV/paste-based variable data for batch orders.
 * Handles wedding place cards, event badges, staff uniforms, etc.
 */
const BulkPersonalization: React.FC<Props> = ({ variableFields, onGenerate }) => {
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [error, setError] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const headers = useMemo(() => variableFields.map(f => f.id), [variableFields]);

  const parseCSV = (text: string): BulkRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const csvHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const row: BulkRow = {};
      csvHeaders.forEach((h, i) => { row[h] = vals[i] || ''; });
      return row;
    }).filter(r => Object.values(r).some(v => v));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        if (parsed.length === 0) { setError('No data rows found in CSV.'); return; }
        setRows(parsed);
        setPreviewIndex(0);
      } catch { setError('Failed to parse CSV file.'); }
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    setError('');
    try {
      const parsed = parseCSV(pasteText);
      if (parsed.length === 0) { setError('No data rows found.'); return; }
      setRows(parsed);
      setPreviewIndex(0);
      setPasteMode(false);
    } catch { setError('Failed to parse pasted data.'); }
  };

  const addManualRow = () => {
    const newRow: BulkRow = {};
    headers.forEach(h => { newRow[h] = ''; });
    setRows([...rows, newRow]);
  };

  const updateRow = (idx: number, field: string, value: string) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [field]: value };
    setRows(updated);
  };

  const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));

  const downloadTemplate = () => {
    const csv = headers.join(',') + '\n' + headers.map(() => 'Sample').join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bulk_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card glass-panel" style={{ padding: 20 }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Table size={18} color="var(--accent-neon-blue)" /> Bulk Personalization
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
        Upload a CSV or paste data to generate personalized variations. Each row becomes a unique product.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <label className="btn btn-outline" style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Upload size={14} /> Upload CSV
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => setPasteMode(!pasteMode)}>
          <FileText size={14} style={{ marginRight: 4 }} /> Paste Data
        </button>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={addManualRow}>+ Add Row</button>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={downloadTemplate}>
          <Download size={14} style={{ marginRight: 4 }} /> Template
        </button>
      </div>

      {/* Paste area */}
      {pasteMode && (
        <div style={{ marginBottom: 16 }}>
          <textarea className="input-field" rows={5} value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder={`${headers.join(',')}\nJohn Smith,Table 1\nJane Doe,Table 2`} style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem' }} />
          <button className="btn btn-primary" style={{ marginTop: 8, fontSize: '0.85rem' }} onClick={handlePaste}>Parse Data</button>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'rgba(255,68,68,0.1)', borderRadius: 8, marginBottom: 16, fontSize: '0.85rem', color: '#ff6666' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Data table */}
      {rows.length > 0 && (
        <>
          <div style={{ overflowX: 'auto', marginBottom: 16, border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>#</th>
                  {variableFields.map(f => (
                    <th key={f.id} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>{f.label}</th>
                  ))}
                  <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ background: previewIndex === i ? 'rgba(0,240,255,0.05)' : 'transparent' }}>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{i + 1}</td>
                    {headers.map(h => (
                      <td key={h} style={{ padding: '4px 8px', borderBottom: '1px solid var(--border-color)' }}>
                        <input type="text" value={row[h] || ''} onChange={e => updateRow(i, h, e.target.value)} style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '4px 8px', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
                      </td>
                    ))}
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setPreviewIndex(i)} title="Preview" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-neon-blue)', padding: 2 }}><Eye size={14} /></button>
                        <button onClick={() => removeRow(i)} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444', padding: 2 }}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Check size={14} style={{ verticalAlign: 'middle', marginRight: 4, color: '#00ff88' }} />
              {rows.length} items · Previewing #{previewIndex + 1}
            </span>
            <button className="btn btn-primary" style={{ fontSize: '0.9rem' }} onClick={() => onGenerate(rows)}>
              Generate {rows.length} Variations
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkPersonalization;
