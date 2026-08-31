import { useState, useEffect } from 'react';
import api from '../../api';

export default function ShopkeeperDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wearout_seller_token');
    const shop = JSON.parse(localStorage.getItem('wearout_seller') || '{}');
    if (!token) return;

    Promise.all([
      api.sellerGetProducts(token),
      api.sellerGetOrders(token),
    ]).then(([products, orders]) => {
      const myOrders = Array.isArray(orders) ? orders : [];
      const revenue = myOrders
        .filter((o) => o.status === 'Completed')
        .reduce((sum, o) => sum + (o.total || 0), 0);
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: myOrders.length,
        revenue,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">My Products</p>
          <p className="text-3xl font-bold text-ink mt-1">{stats.products}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-ink mt-1">{stats.orders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Revenue (Completed)</p>
          <p className="text-3xl font-bold text-gold mt-1">Rs {stats.revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
