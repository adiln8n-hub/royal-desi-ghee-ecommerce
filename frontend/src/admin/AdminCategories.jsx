import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLayout.css';
import './AdminModal.css';
import './AdminShared.css';

const EMPTY = { nameEn: '', nameUr: '', slug: '', image: '', description: '' };

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/categories');
      setCats(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ nameEn: c.nameEn, nameUr: c.nameUr, slug: c.slug, image: c.image || '', description: c.description || '' });
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`/api/categories/${editing}`, form);
      } else {
        await axios.post('/api/categories', form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      load();
    } catch (e) { alert('Delete failed'); }
  };

  const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>📂 Categories ({cats.length})</h1>
        <button className="btn btn-primary" onClick={openAdd} id="add-category-btn">+ Add Category</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="categories-admin-grid">
          {cats.map(cat => (
            <div key={cat._id} className="cat-admin-card">
              <div className="cat-admin-img">
                <img src={cat.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop'} alt={cat.nameEn} />
              </div>
              <div className="cat-admin-info">
                <div className="cat-admin-name-en">{cat.nameEn}</div>
                <div className="cat-admin-name-ur" dir="rtl">{cat.nameUr}</div>
                <div className="cat-admin-slug">/{cat.slug}</div>
              </div>
              <div className="cat-admin-actions">
                <button className="btn btn-sm btn-outline" onClick={() => openEdit(cat)} id={`edit-cat-${cat._id}`}>✏️ Edit</button>
                <button className="btn btn-sm" onClick={() => handleDelete(cat._id)} id={`delete-cat-${cat._id}`}
                  style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Category' : '➕ Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label>Name (English) *</label>
                <input className="form-control" value={form.nameEn} required
                  onChange={e => setForm(f => ({ ...f, nameEn: e.target.value, slug: editing ? f.slug : autoSlug(e.target.value) }))}
                  placeholder="Desi Ghee" id="cat-name-en" />
              </div>
              <div className="form-group">
                <label>نام (اردو) *</label>
                <input className="form-control" value={form.nameUr} dir="rtl" required
                  onChange={e => setForm(f => ({ ...f, nameUr: e.target.value }))}
                  placeholder="دیسی گھی" id="cat-name-ur" />
              </div>
              <div className="form-group">
                <label>Slug * (auto-generated)</label>
                <input className="form-control" value={form.slug} required
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="desi-ghee" id="cat-slug" />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input className="form-control" value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..." id="cat-image" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={2} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} id="cat-desc" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" id="save-category-btn" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editing ? '✅ Update' : '✅ Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
