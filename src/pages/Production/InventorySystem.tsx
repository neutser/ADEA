import React, { useEffect, useState } from 'react';
import { AlertTriangle, Package, ShoppingCart, Save, Edit2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE } from '@/config';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  min_level: number;
  unit: string;
  price: number;
}

const InventorySystem: React.FC = () => {
  const { token, user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{stock: number, min_level: number, price: number}>({stock: 0, min_level: 0, price: 0});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({name: '', category: 'Acrylic', stock: 0, min_level: 5, unit: 'sheets', price: 0});

  const fetchInventory = () => {
    if (!token) return;
    fetch(`${API_BASE}/api/inventory`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setInventory(data.items || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleSaveEdit = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
      fetchInventory();
    } catch(e) { console.error(e); }
  };

  const handleAddItem = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newItem)
      });
      setShowAdd(false);
      fetchInventory();
    } catch(e) { console.error(e); }
  };

  const lowStock = inventory.filter(i => i.stock <= i.min_level);
  const totalValue = inventory.reduce((sum, i) => sum + i.stock * i.price, 0);

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="heading-lg">Inventory Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time stock tracking for all production materials.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {user?.role === 'admin' && (
              <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }} onClick={() => setShowAdd(!showAdd)}>
                <Plus size={18}/> Add Item
              </button>
            )}
            <button className="btn btn-primary" style={{ display: 'flex', gap: '8px' }}><ShoppingCart size={18}/> Place Restock Order</button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="card glass-panel" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Total SKUs</p>
            <h3 className="heading-md">{inventory.length}</h3>
          </div>
          <div className="card glass-panel" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Inventory Value</p>
            <h3 className="heading-md">${totalValue.toFixed(2)}</h3>
          </div>
          <div className="card glass-panel" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Low Stock Alerts</p>
            <h3 className="heading-md" style={{ color: lowStock.length > 0 ? '#ff4444' : '#00ff88' }}>{lowStock.length}</h3>
          </div>
          <div className="card glass-panel" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Categories</p>
            <h3 className="heading-md">{new Set(inventory.map(i => i.category)).size}</h3>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStock.length > 0 && (
          <div style={{ background: '#ff444415', border: '1px solid #ff444444', borderRadius: '8px', padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="#ff4444" />
            <span style={{ color: '#ff6b6b' }}><strong>{lowStock.length} items</strong> are at or below minimum stock level and need reordering.</span>
          </div>
        )}

        {/* Add Item Form */}
        {showAdd && (
          <div className="card glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--accent-neon-blue)' }}>
            <h3 className="heading-md" style={{ marginBottom: '16px' }}>Add New Material</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
              <div><label>Name</label><input className="input" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} placeholder="Item name"/></div>
              <div><label>Category</label><input className="input" value={newItem.category} onChange={e=>setNewItem({...newItem, category: e.target.value})} /></div>
              <div><label>Unit</label><input className="input" value={newItem.unit} onChange={e=>setNewItem({...newItem, unit: e.target.value})} /></div>
              <div><label>Stock</label><input className="input" type="number" value={newItem.stock} onChange={e=>setNewItem({...newItem, stock: +e.target.value})} /></div>
              <div><label>Min</label><input className="input" type="number" value={newItem.min_level} onChange={e=>setNewItem({...newItem, min_level: +e.target.value})} /></div>
              <div><label>Price</label><input className="input" type="number" step="0.01" value={newItem.price} onChange={e=>setNewItem({...newItem, price: +e.target.value})} /></div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddItem}>Save Item</button>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Material', 'Category', 'In Stock', 'Min. Level', 'Unit Price', 'Value', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const isLow = item.stock <= item.min_level;
                  const isEditing = editingId === item.id;
                  
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', background: isLow ? '#ff444408' : 'transparent' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '2px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', fontSize: '0.8rem' }}>{item.category}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: isLow ? '#ff4444' : 'var(--text-primary)' }}>
                        {isEditing ? (
                          <input type="number" className="input" style={{ width: '80px', padding: '4px 8px' }} value={editForm.stock} onChange={e=>setEditForm({...editForm, stock: +e.target.value})} />
                        ) : (
                          `${item.stock} ${item.unit}`
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                        {isEditing ? (
                          <input type="number" className="input" style={{ width: '80px', padding: '4px 8px' }} value={editForm.min_level} onChange={e=>setEditForm({...editForm, min_level: +e.target.value})} />
                        ) : item.min_level}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                        {isEditing ? (
                          <input type="number" step="0.01" className="input" style={{ width: '80px', padding: '4px 8px' }} value={editForm.price} onChange={e=>setEditForm({...editForm, price: +e.target.value})} />
                        ) : `$${item.price.toFixed(2)}`}
                      </td>
                      <td style={{ padding: '14px 20px' }}>${(item.stock * item.price).toFixed(2)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {isLow ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff4444', fontWeight: 600, fontSize: '0.85rem' }}>
                            <AlertTriangle size={14}/> Low Stock
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00ff88', fontSize: '0.85rem' }}>
                            <Package size={14}/> OK
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {user?.role === 'admin' && (
                          isEditing ? (
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#00ff88', borderColor: '#00ff88' }} onClick={() => handleSaveEdit(item.id)}>
                              <Save size={14}/>
                            </button>
                          ) : (
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => {
                              setEditingId(item.id);
                              setEditForm({ stock: item.stock, min_level: item.min_level, price: item.price });
                            }}>
                              <Edit2 size={14}/>
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventorySystem;
