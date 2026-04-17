import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLayout.css';
import './AdminModal.css';
import './AdminShared.css';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await axios.get(`/api/orders${params}`);
      setOrders(res.data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      load();
      if (selected?._id === orderId) {
        setSelected(prev => ({ ...prev, status }));
      }
    } catch (e) { alert('Failed to update status'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>🛒 Orders ({orders.length})</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${!statusFilter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter('')} id="filter-all-orders">All</button>
          {STATUSES.map(s => (
            <button key={s} id={`filter-${s.toLowerCase()}`}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter(statusFilter === s ? '' : s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <table>
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td><strong style={{ color: 'var(--green-primary)' }}>#{order.orderNumber}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer?.phone}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.customer?.city}</div>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--green-primary)' }}>Rs. {order.total?.toLocaleString()}</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        id={`status-${order._id}`}
                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div style={{ marginTop: '0.2rem' }}>
                        <span className={`status-pill status-${order.status}`}>{order.status}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => setSelected(order)} id={`view-order-${order._id}`}>
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3>Order #{selected.orderNumber}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="order-detail-field"><span className="od-label">Customer</span><span>{selected.customer?.name}</span></div>
                <div className="order-detail-field"><span className="od-label">Phone</span><span>{selected.customer?.phone}</span></div>
                <div className="order-detail-field" style={{ gridColumn: '1 / -1' }}><span className="od-label">Address</span><span>{selected.customer?.address}, {selected.customer?.city}</span></div>
                {selected.notes && <div className="order-detail-field" style={{ gridColumn: '1 / -1' }}><span className="od-label">Notes</span><span>{selected.notes}</span></div>}
              </div>

              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ORDER ITEMS</p>
                {selected.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</div>
                      {item.weight && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.weight} × {item.quantity}</div>}
                    </div>
                    <div style={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="order-summary-mini">
                <div className="summary-row"><span>Subtotal</span><span>Rs. {selected.subtotal?.toLocaleString()}</span></div>
                <div className="summary-row"><span>Delivery</span><span>{selected.deliveryFee === 0 ? 'FREE' : `Rs. ${selected.deliveryFee}`}</span></div>
                <div className="summary-row summary-total"><strong>Total</strong><strong>Rs. {selected.total?.toLocaleString()}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span className="od-label">Update Status:</span>
                <select className="form-control" style={{ flex: 1, fontSize: '0.875rem' }}
                  value={selected.status}
                  onChange={e => {
                    const newStatus = e.target.value;
                    updateStatus(selected._id, newStatus);
                    setSelected(prev => ({ ...prev, status: newStatus }));
                  }}
                  id="modal-status-select"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
