import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function SellerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ shopName: '', ownerName: '', phone: '', email: '', password: '', city: '', address: '', cnic: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.sellerSignup(form);
      navigate('/seller/login', { state: { msg: 'Account created. Waiting for admin approval.' } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h1 className="font-display text-3xl text-ink tracking-widest text-center mb-1">SELLER SIGNUP</h1>
        <p className="text-slate-500 text-xs uppercase tracking-widest text-center mb-6">Start selling on Wear Out</p>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input className="input-field" placeholder="Shop / Business Name *" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} required />
          <input className="input-field" placeholder="Owner Name *" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required />
          <input className="input-field" placeholder="Phone / WhatsApp *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="input-field" type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input-field" type="password" placeholder="Password (min 6 chars) *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="input-field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="input-field" placeholder="CNIC / Business Reg (optional)" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? 'Creating Account…' : 'Sign Up'}</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/seller/login" className="text-gold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
