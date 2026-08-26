import { useEffect, useState } from 'react';
import api from '../../api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => { api.getCustomers().then(setCustomers); }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Customers</h1>
      <div className="admin-surface overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">WhatsApp</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Orders</th>
              <th className="text-left p-3">Total Spent</th>
              <th className="text-left p-3">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t border-slate-100">
                <td className="p-3 text-ink font-medium">{c.name}</td>
                <td className="p-3 text-slate-600">{c._id}</td>
                <td className="p-3 text-slate-600">{c.email}</td>
                <td className="p-3 text-slate-600">{c.city}</td>
                <td className="p-3 text-ink">{c.orderCount}</td>
                <td className="p-3 text-ink">Rs {c.totalSpent.toLocaleString()}</td>
                <td className="p-3 text-slate-500">{new Date(c.lastOrder).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="7" className="p-4 text-center text-slate-400">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
