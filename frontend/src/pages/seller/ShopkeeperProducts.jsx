import { useState, useEffect } from 'react';
import api from '../../api';
import { imgUrl } from '../../lib/img';

const EMPTY = { name: '', description: '', price: '', category: 'Shirts', sizes: 'S,M,L,XL', gender: 'Unisex', inStock: true, image: null };

export default function ShopkeeperProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('wearout_seller_token');

  const load = () => api.sellerGetProducts(token).then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, sizes: p.sizes.join(','), gender: p.gender || 'Unisex', inStock: p.inStock, image: null });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('sizes', form.sizes);
    fd.append('gender', form.gender);
    fd.append('inStock', form.inStock);
    if (form.image) fd.append('image', form.image);

    try {
      if (editing) await api.sellerUpdateProduct(token, editing, fd);
      else await api.sellerCreateProduct(token, fd);
      setMsg(editing ? 'Updated successfully' : 'Added successfully');
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'save failed'));
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.sellerDeleteProduct(token, id);
    await load();
  };

  const requestFeatured = async (id) => {
    try {
      await api.sellerRequestFeatured(token, id);
      setMsg('Featured request sent to admin');
      await load();
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'request failed'));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">My Products</h1>
        <button className="btn-gold" onClick={openAdd}>+ Add Product</button>
      </div>
      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      {form && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Shirts', 'Trousers', 'Caps', 'Watches', 'Accessories', 'Shoes', 'Un Stitch'].map((c) => (<option key={c}>{c}</option>))}
          </select>
          <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            {['Unisex', 'Male', 'Female'].map((g) => (<option key={g}>{g}</option>))}
          </select>
          <input className="input-field" placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          <textarea className="input-field md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="file" accept="image/*" className="md:col-span-2 text-sm" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-gold">Save</button>
            <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="p-3">{p.image ? <img src={imgUrl(p.image)} alt={p.name} className="h-12 w-10 object-cover rounded" /> : <span className="text-slate-300">—</span>}</td>
                  <td className="p-3 text-ink font-medium">{p.name}</td>
                  <td className="p-3 text-slate-500">{p.category}</td>
                  <td className="p-3 text-ink">Rs {p.price.toLocaleString()}</td>
                  <td className="p-3">
                    {p.featured && <span className="text-xs bg-gold/10 text-gold-dark px-2 py-1 rounded-full">Featured</span>}
                    {!p.featured && p.featuredPending && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Featured Request Pending</span>}
                    {!p.featured && !p.featuredPending && <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="p-3 space-x-2">
                    <button className="text-gold-dark hover:underline" onClick={() => openEdit(p)}>Edit</button>
                    {!p.featured && !p.featuredPending && (
                      <button className="text-blue-500 hover:underline" onClick={() => requestFeatured(p._id)}>★ Request Featured</button>
                    )}
                    <button className="text-red-500 hover:underline" onClick={() => remove(p._id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-slate-400">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
