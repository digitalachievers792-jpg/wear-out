import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';

const links = [
  { to: '/seller', label: 'Dashboard', end: true },
  { to: '/seller/products', label: 'Products' },
  { to: '/seller/orders', label: 'Orders' },
  { to: '/seller/customers', label: 'Customers' },
];

export default function ShopkeeperLayout() {
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('wearout_seller_token');
    const data = localStorage.getItem('wearout_seller');
    if (!token || !data) { navigate('/seller/login'); return; }
    setShop(JSON.parse(data));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('wearout_seller_token');
    localStorage.removeItem('wearout_seller');
    navigate('/seller/login');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  if (!shop) return null;

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/seller" className="font-display text-lg tracking-widest text-ink">SELLER PANEL</Link>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-500">{shop.shopName}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
          </div>
          <button className="md:hidden text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-2 space-y-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setMenuOpen(false)}>{l.label}</NavLink>
            ))}
            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100 rounded-lg">Logout</button>
          </div>
        )}
      </header>
      <nav className="hidden md:block bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
