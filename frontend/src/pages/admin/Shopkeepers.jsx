import { useState, useEffect } from 'react';
import api from '../../api';

export default function Shopkeepers() {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getShopkeepers().then(setShopkeepers).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.updateShopkeeperStatus(id, status);
    await load();
  };

  const filtered = filter === 'all' ? shopkeepers : shopkeepers.filter((s) => s.status === filter);

  if (loading) return <p className="text-slate-400">Loading shopkeepers…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Shopkeepers</h1>

      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved', 'rejected', 'suspended'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${filter === f ? 'bg-black text-white border-black' : 'border-slate-300 text-slate-600 hover:border-black'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Shop Name</th>
                <th className="text-left p-3">Owner</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{s.shopName}</td>
                  <td className="p-3 text-slate-600">{s.ownerName}</td>
                  <td className="p-3 text-slate-600">{s.phone}</td>
                  <td className="p-3 text-slate-600">{s.email}</td>
                  <td className="p-3 text-slate-500">{s.city || '—'}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      s.status === 'approved' ? 'bg-green-100 text-green-700' :
                      s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      s.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{s.status}</span>
                  </td>
                  <td className="p-3 space-x-2">
                    {s.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:underline text-xs" onClick={() => updateStatus(s._id, 'approved')}>Approve</button>
                        <button className="text-red-500 hover:underline text-xs" onClick={() => updateStatus(s._id, 'rejected')}>Reject</button>
                      </>
                    )}
                    {s.status === 'approved' && (
                      <button className="text-orange-500 hover:underline text-xs" onClick={() => updateStatus(s._id, 'suspended')}>Suspend</button>
                    )}
                    {s.status === 'suspended' && (
                      <button className="text-green-600 hover:underline text-xs" onClick={() => updateStatus(s._id, 'approved')}>Re-approve</button>
                    )}
                    {s.status === 'rejected' && (
                      <button className="text-green-600 hover:underline text-xs" onClick={() => updateStatus(s._id, 'approved')}>Approve</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="7" className="p-4 text-center text-slate-400">No shopkeepers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
