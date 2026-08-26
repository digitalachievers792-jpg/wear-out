import { useEffect, useState } from 'react';
import api from '../../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  Completed: '#16a34a',
  'On Delivery': '#c9a24b',
  Returned: '#dc2626',
  Cancelled: '#6b7280',
};

export default function Logistics() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.getLogistics(month, year).then(setData);
  }, [month, year]);

  if (!data) return <p className="text-slate-400">Loading…</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-ink">AI Logistics Intelligence</h1>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <select className="input-field !w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select className="input-field !w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {!data.hasData ? (
        <p className="admin-surface p-6 text-slate-500">Not enough data yet.</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Donut */}
            <div className="admin-surface p-5">
              <h2 className="font-semibold text-ink mb-2">Order Outcomes</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.donut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label={({ name, percent }) => `${name}: ${percent}%`}>
                    {data.donut.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Return risk */}
            <div className="admin-surface p-5">
              <h2 className="font-semibold text-ink mb-2">Return Risk</h2>
              {data.returnRisk.length === 0 ? (
                <p className="text-slate-500 text-sm">No high-risk customers detected.</p>
              ) : (
                <div className="space-y-2">
                  {data.returnRisk.map((r) => (
                    <div key={r.whatsapp} className="flex justify-between items-center border border-red-100 bg-red-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-ink font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-slate-500">{r.whatsapp} · {r.totalOrders} orders, {r.returnedOrders} returned</p>
                      </div>
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">{r.risk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Best courier by city */}
          <div className="admin-surface overflow-x-auto mt-6">
            <h2 className="font-semibold text-ink p-4 pb-0">Best Courier by City</h2>
            <table className="w-full text-sm min-w-[600px] mt-3">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left p-3">City</th>
                  <th className="text-left p-3">Best Courier</th>
                  <th className="text-left p-3">Avg Delivery Time</th>
                  <th className="text-left p-3">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.bestByCity.map((c) => (
                  <tr key={c.city} className="border-t border-slate-100">
                    <td className="p-3 text-ink font-medium">{c.city}</td>
                    <td className="p-3 text-slate-600">{c.bestCourier}</td>
                    <td className="p-3 text-slate-600">{c.avgDeliveryTime} h</td>
                    <td className="p-3 text-slate-600">{c.successRate}%</td>
                  </tr>
                ))}
                {data.bestByCity.length === 0 && (
                  <tr><td colSpan="4" className="p-4 text-center text-slate-400">No delivery data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Delivery time prediction */}
          <div className="admin-surface p-5 mt-6">
            <h2 className="font-semibold text-ink mb-2">Delivery Time Prediction</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {data.predictions.map((p) => (
                <div key={p.city} className="border border-slate-200 rounded-lg p-3">
                  <p className="text-ink font-medium">{p.city}</p>
                  <p className="text-sm text-slate-500">{p.courier} · ~{p.estimatedDays} day(s)</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
