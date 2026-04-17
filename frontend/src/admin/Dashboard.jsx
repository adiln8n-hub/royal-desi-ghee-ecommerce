import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLayout.css';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('/api/orders/stats'),
          axios.get('/api/orders?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '🛒', color: '#3B82F6' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: '⏳', color: '#F59E0B' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: '✅', color: '#22C55E' },
    { label: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#C9A84C' },
  ];

  return (
    <div>
      <h1 className="admin-page-title">📊 Dashboard</h1>

      {/* Stat Cards */}
      <div className="dashboard-stats">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card-icon" style={{ background: c.color + '20', color: c.color }}>
              {c.icon}
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">🕐 Recent Orders</span>
          <a href="/admin/orders" className="btn btn-sm btn-outline">View All</a>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order.orderNumber}</strong></td>
                  <td>{order.customer?.name}<br/><small style={{ color: 'var(--text-muted)' }}>{order.customer?.phone}</small></td>
                  <td style={{ fontWeight: 700 }}>Rs. {order.total?.toLocaleString()}</td>
                  <td><span className={`status-pill status-${order.status}`}>{order.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-PK')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4 style={{ color: 'var(--text-mid)', marginBottom: '0.75rem' }}>Quick Actions</h4>
        <div className="quick-action-grid">
          <a href="/admin/products" className="quick-action-card" id="qa-add-product">
            <span className="qa-icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="/admin/orders" className="quick-action-card" id="qa-view-orders">
            <span className="qa-icon">📋</span>
            <span>View Orders</span>
          </a>
          <a href="/admin/categories" className="quick-action-card" id="qa-categories">
            <span className="qa-icon">📂</span>
            <span>Categories</span>
          </a>
          <a href="/" target="_blank" className="quick-action-card" id="qa-view-store">
            <span className="qa-icon">🌐</span>
            <span>View Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
