import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/seller', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seller/products', label: 'Products', icon: '📦' },
  { to: '/seller/orders', label: 'Orders', icon: '🛒' },
  { to: '/seller/customers', label: 'Customers', icon: '👥' },
];

export default function ShopkeeperLayout() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const mobileLinkClass = (path) => {
    const isActive = path === '/seller' ? location.pathname === '/seller' : location.pathname.startsWith(path);
    return `flex flex-col items-center gap-0.5 text-[10px] transition-colors ${isActive ? 'text-gold' : 'text-slate-400'}`;
  };

  if (!shop) return null;

  return (
    <div className="min-h-screen bg-mist pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/seller" className="font-display text-lg tracking-widest text-ink">SELLER PANEL</Link>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-500">{shop.shopName}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
          </div>
          <button className="md:hidden text-slate-600 text-xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-2 space-y-1">
            <p className="text-xs text-slate-400 px-4 py-1">{shop.shopName}</p>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setMenuOpen(false)}>{l.icon} {l.label}</NavLink>
            ))}
            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100 rounded-lg">Logout</button>
          </div>
        )}
      </header>

      {/* Desktop nav */}
      <nav className="hidden md:block bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-1 safe-area-bottom">
        <div className="flex justify-around">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLinkClass(l.to)}>
              <span className="text-xl">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
