import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card animate-scale">
        <div className="admin-login-header">
          <span className="admin-crown">👑</span>
          <h1>Royal Ghee & Sweets</h1>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} id="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              className="form-control"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw(s => !s)}
              aria-label="Toggle password visibility"
              id="toggle-password-btn"
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            id="admin-login-submit-btn"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="back-link">← Back to Store</a>
        </div>
      </div>
    </div>
  );
}
