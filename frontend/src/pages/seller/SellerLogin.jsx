import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';

export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const msg = location.state?.msg || '';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.sellerLogin(form.email, form.password);
      localStorage.setItem('wearout_seller_token', res.token);
      localStorage.setItem('wearout_seller', JSON.stringify(res.shopkeeper));
      navigate('/seller');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h1 className="font-display text-3xl text-ink tracking-widest text-center mb-1">SELLER LOGIN</h1>
        <p className="text-slate-500 text-xs uppercase tracking-widest text-center mb-6">Shopkeeper Panel</p>
        {msg && <p className="text-green-600 text-sm mb-3 text-center">{msg}</p>}
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/seller/signup" className="text-gold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
