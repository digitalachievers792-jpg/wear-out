import { useState, useEffect } from 'react';
import api from '../../api';

const STATUSES = ['Pending', 'Confirmed', 'On Delivery', 'Completed', 'Returned', 'Cancelled'];

export default function ShopkeeperOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('wearout_seller_token');

  const load = () => {
    setLoading(true);
    api.sellerGetOrders(token).then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.sellerUpdateOrderStatus(token, id, status);
    await load();
  };

  const copyCustomer = (o) => {
    const c = o.customer || {};
    const text = `Name: ${c.fullName || ''}\nPhone: ${c.whatsapp || ''}\nEmail: ${c.email || ''}\nCity: ${c.city || ''}\nAddress: ${c.address || ''}`;
    navigator.clipboard.writeText(text).then(() => alert('Customer data copied!'));
  };

  if (loading) return <p className="text-slate-400">Loading orders…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">My Orders</h1>
      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Ref</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Size</th>
                <th className="text-left p-3">Qty</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{o.reference}</td>
                  <td className="p-3 text-slate-600">{o.customer?.fullName}<br /><span className="text-xs text-slate-400">{o.customer?.whatsapp}</span></td>
                  <td className="p-3 text-slate-600">{o.items?.map((it) => it.name).join(', ')}</td>
                  <td className="p-3 text-slate-500">{o.items?.map((it) => it.size).join(', ')}</td>
                  <td className="p-3 text-slate-500">{o.items?.map((it) => it.quantity).join(', ')}</td>
                  <td className="p-3 text-ink">Rs {(o.total || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <button className="text-gold-dark hover:underline text-xs" onClick={() => copyCustomer(o)}>Copy Info</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="8" className="p-4 text-center text-slate-400">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
