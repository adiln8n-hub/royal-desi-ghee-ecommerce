import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/orders', label: 'Orders', icon: '🛒' },
  { to: '/admin/categories', label: 'Categories', icon: '📂' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo-crown">👑</span>
          <div>
            <div className="admin-brand">Royal Ghee</div>
            <div className="admin-panel-label">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navLinks.map(({ to, label, icon, exact }) => {
            const isActive = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link key={to} to={to} id={`nav-${label.toLowerCase()}`}
                className={`admin-nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">{admin?.name?.[0] || 'A'}</div>
            <div>
              <div className="admin-name">{admin?.name || 'Admin'}</div>
              <div className="admin-email">{admin?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href="/" target="_blank" className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              🌐 View Store
            </a>
            <button id="admin-logout-btn" className="btn btn-sm" onClick={handleLogout}
              style={{ flex: 1, justifyContent: 'center', background: 'rgba(107,20,20,0.15)', color: 'var(--maroon)', border: '1px solid rgba(107,20,20,0.3)' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-breadcrumb">
            {navLinks.find(l => l.exact ? pathname === l.to : pathname.startsWith(l.to))?.label || 'Admin'}
          </div>
          <div className="topbar-time">
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
