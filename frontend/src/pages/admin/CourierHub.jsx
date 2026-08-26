import { useEffect, useState } from 'react';
import api from '../../api';

export default function CourierHub() {
  const [couriers, setCouriers] = useState([]);
  const [insights, setInsights] = useState(null);

  const load = async () => {
    const [c, o] = await Promise.all([api.getCouriers(), api.getOptimizer()]);
    setCouriers(c);
    setInsights(o);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    await api.toggleCourier(id);
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Courier Hub</h1>

      {insights?.ready ? (
        <div className="admin-surface p-4 mb-6 border-l-4 border-gold">
          <p className="text-sm font-semibold text-ink mb-1">AI Delivery Optimizer</p>
          <ul className="text-sm text-slate-600 space-y-1">
            {insights.insights.map((i, idx) => <li key={idx}>• {i.text}</li>)}
          </ul>
        </div>
      ) : (
        <div className="admin-surface p-4 mb-6 border-l-4 border-slate-300">
          <p className="text-sm text-slate-500">AI Delivery Optimizer: not enough delivery data yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {couriers.map((c) => (
          <div key={c._id} className="admin-surface p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-ink text-lg">{c.name}</h3>
              <span className="text-gold-dark font-semibold text-sm">★ {c.rating}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Rate: {c.rating} / 5</p>
            <button
              className={c.connected ? 'btn-outline w-full !py-2' : 'btn-gold w-full'}
              onClick={() => toggle(c._id)}
            >
              {c.connected ? 'Connected ✓' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
