import { useState, useEffect } from 'react';
import api from '../../api';

export default function FeaturedRequests() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    api.getFeaturedRequests().then(setProducts).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.approveFeatured(id);
      setMsg('Product approved as featured');
      await load();
    } catch { setMsg('Error approving'); }
  };

  const reject = async (id) => {
    try {
      await api.rejectFeatured(id);
      setMsg('Featured request rejected');
      await load();
    } catch { setMsg('Error rejecting'); }
  };

  if (loading) return <p className="text-slate-400">Loading requests…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Featured Product Requests</h1>
      {msg && <p className="text-sm text-gold-dark mb-3">{msg}</p>}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Shop</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{p.name}</td>
                  <td className="p-3 text-slate-500">{p.shopName || '—'}</td>
                  <td className="p-3 text-ink">Rs {p.price?.toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-green-600 hover:underline" onClick={() => approve(p._id)}>Approve</button>
                    <button className="text-red-500 hover:underline" onClick={() => reject(p._id)}>Reject</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-slate-400">No pending featured requests.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
