import { useState, useEffect } from 'react';
import api from '../../api';

export default function ShopkeeperCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('wearout_seller_token');

  useEffect(() => {
    api.sellerGetCustomers(token).then(setCustomers).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading customers…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">My Customers</h1>
      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">WhatsApp</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{c.fullName}</td>
                  <td className="p-3 text-slate-600">{c.whatsapp}</td>
                  <td className="p-3 text-slate-600">{c.email}</td>
                  <td className="p-3 text-slate-500">{c.city}</td>
                  <td className="p-3 text-slate-500">{c.address}</td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-400">No customers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
