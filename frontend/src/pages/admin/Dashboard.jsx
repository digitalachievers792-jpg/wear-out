import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAdminAuth } from '../../context/AdminAuth';

const STATUS_COLORS = {
  Completed: '#16a34a',
  'On Delivery': '#c9a24b',
  Returned: '#dc2626',
  Cancelled: '#6b7280',
};

export default function Dashboard() {
  const { email } = useAdminAuth();
  const now = new Date();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard(now.getMonth() + 1, now.getFullYear()).then(setData);
  }, []);

  const cards = data
    ? [
        { label: 'Total Orders', value: data.total, color: '#c9a24b' },
        { label: 'Completed', value: data.categories.Completed, color: STATUS_COLORS.Completed },
        { label: 'On Delivery', value: data.categories['On Delivery'], color: STATUS_COLORS['On Delivery'] },
        { label: 'Returned', value: data.categories.Returned, color: STATUS_COLORS.Returned },
        { label: 'Cancelled', value: data.categories.Cancelled, color: STATUS_COLORS.Cancelled },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Welcome back, {email}</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="admin-surface p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{c.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="admin-surface p-5 hover:border-gold/40">
          <p className="font-semibold text-ink">Manage Products</p>
          <p className="text-sm text-slate-500">Add, edit, remove items</p>
        </Link>
        <Link to="/admin/orders" className="admin-surface p-5 hover:border-gold/40">
          <p className="font-semibold text-ink">Orders</p>
          <p className="text-sm text-slate-500">Fulfill & copy details</p>
        </Link>
        <Link to="/admin/logistics" className="admin-surface p-5 hover:border-gold/40">
          <p className="font-semibold text-ink">Logistics AI</p>
          <p className="text-sm text-slate-500">Courier insights</p>
        </Link>
      </div>
    </div>
  );
}
