import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLayout.css';

const EMPTY_FORM = {
  titleEn: '', titleUr: '', descriptionEn: '', descriptionUr: '',
  price: '', discountPrice: '', stock: '', category: '',
  images: '', isFeatured: false, isActive: true,
  weightOptions: [{ label: '', price: '' }],
  tags: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pr, ca] = await Promise.all([
        axios.get('/api/products/admin/all'),
        axios.get('/api/categories'),
      ]);
      setProducts(pr.data || []);
      setCategories(ca.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category: categories[0]?._id || '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      titleEn: p.titleEn, titleUr: p.titleUr,
      descriptionEn: p.descriptionEn, descriptionUr: p.descriptionUr,
      price: p.price, discountPrice: p.discountPrice || '',
      stock: p.stock, category: p.category?._id || p.category,
      images: (p.images || []).join('\n'),
      isFeatured: p.isFeatured, isActive: p.isActive,
      weightOptions: p.weightOptions?.length ? p.weightOptions : [{ label: '', price: '' }],
      tags: (p.tags || []).join(', '),
    });
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        weightOptions: form.weightOptions.filter(w => w.label).map(w => ({ ...w, price: Number(w.price) })),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editing) {
        await axios.put(`/api/products/${editing}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setDeleteConfirm(null);
      load();
    } catch (e) { alert('Delete failed'); }
  };

  const addWeightRow = () => setForm(f => ({ ...f, weightOptions: [...f.weightOptions, { label: '', price: '' }] }));
  const removeWeightRow = (i) => setForm(f => ({ ...f, weightOptions: f.weightOptions.filter((_, idx) => idx !== i) }));
  const updateWeight = (i, field, val) => setForm(f => ({
    ...f,
    weightOptions: f.weightOptions.map((w, idx) => idx === i ? { ...w, [field]: val } : w)
  }));

  const filtered = products.filter(p =>
    p.titleEn?.toLowerCase().includes(search.toLowerCase()) ||
    p.titleUr?.includes(search)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>📦 Products ({products.length})</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '220px', fontSize: '0.875rem' }}
            id="admin-product-search"
          />
          <button className="btn btn-primary" onClick={openAdd} id="add-product-btn">+ Add Product</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>Title</th><th>Price</th><th>Discount</th><th>Stock</th><th>Featured</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No products found</td></tr>
                ) : filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&h=60&fit=crop'}
                        alt={p.titleEn} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.titleEn}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.titleUr}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>Rs. {p.price?.toLocaleString()}</td>
                    <td style={{ color: p.discountPrice ? '#22C55E' : 'var(--text-muted)' }}>
                      {p.discountPrice ? `Rs. ${p.discountPrice?.toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <span className={`status-pill ${p.stock > 0 ? 'status-Delivered' : 'status-Cancelled'}`}>
                        {p.stock} left
                      </span>
                    </td>
                    <td>{p.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <span className={`status-pill ${p.isActive ? 'status-Delivered' : 'status-Cancelled'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)} id={`edit-product-${p._id}`}>✏️ Edit</button>
                        <button className="btn btn-sm" onClick={() => setDeleteConfirm(p._id)}
                          style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Delete Product?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn" onClick={() => handleDelete(deleteConfirm)} id="confirm-delete-btn"
                style={{ flex: 1, justifyContent: 'center', background: '#DC2626', color: 'white', border: 'none' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box product-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Product' : '➕ Add Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close modal">×</button>
            </div>

            <form onSubmit={handleSave} className="product-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input className="form-control" value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} placeholder="Pure Desi Ghee" required />
                </div>
                <div className="form-group">
                  <label>عنوان (اردو) *</label>
                  <input className="form-control" value={form.titleUr} onChange={e => setForm(f => ({ ...f, titleUr: e.target.value }))} placeholder="خالص دیسی گھی" required dir="rtl" />
                </div>
              </div>

              <div className="form-group">
                <label>Description (English) *</label>
                <textarea className="form-control" rows={2} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>تفصیل (اردو) *</label>
                <textarea className="form-control" rows={2} value={form.descriptionUr} onChange={e => setForm(f => ({ ...f, descriptionUr: e.target.value }))} required dir="rtl" />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" className="form-control" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} min="0" required />
                </div>
                <div className="form-group">
                  <label>Discount Price</label>
                  <input type="number" className="form-control" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} min="0" />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" className="form-control" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" required />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Image URLs (one per line)</label>
                <textarea className="form-control" rows={2} value={form.images}
                  onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..." />
              </div>

              {/* Weight Options */}
              <div className="form-group">
                <label>Weight Options</label>
                {form.weightOptions.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input className="form-control" placeholder="Label (e.g. 1 kg)" value={w.label}
                      onChange={e => updateWeight(i, 'label', e.target.value)} style={{ flex: 2 }} />
                    <input type="number" className="form-control" placeholder="Price" value={w.price}
                      onChange={e => updateWeight(i, 'price', e.target.value)} style={{ flex: 1 }} />
                    <button type="button" onClick={() => removeWeightRow(i)}
                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '0 0.5rem', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline" onClick={addWeightRow}>+ Add Weight</button>
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input className="form-control" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ghee, pure, premium" />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                  ⭐ Featured
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  ✅ Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" id="save-product-btn" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editing ? '✅ Update Product' : '✅ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
