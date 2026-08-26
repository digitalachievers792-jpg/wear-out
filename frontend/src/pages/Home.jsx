import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BrandHero from '../components/BrandHero';
import api from '../api';
import { useConfig } from '../context/ConfigContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = useConfig();

  useEffect(() => {
    api
      .getProducts({ featured: 'true' })
      .then((p) => setProducts(p.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  const realCats = (config?.categories || []).filter((c) => !c.comingSoon);

  return (
    <div>
      {/* Scroll-driven brand wordmark hero (light theme), featured image reveals on scroll */}
      <BrandHero />

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-metallic tracking-wider">DROP 001</h2>
            <p className="text-slate-500 mt-1">Fresh fits. Wear your confidence.</p>
          </div>
          <Link to="/shirts" className="text-gold text-sm uppercase tracking-widest hover:underline">
            Shop all →
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-slate-400">No products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-display text-4xl text-metallic text-center mb-10 tracking-wider">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {realCats.map((c) => (
              <Link
                key={c.name}
                to={`/${c.name.toLowerCase()}`}
                className="group relative h-40 rounded-xl overflow-hidden border border-gold/20 flex items-center justify-center bg-mist hover:border-gold/60 transition-colors"
              >
                <span className="font-display text-3xl text-slate-700 group-hover:text-gold tracking-widest transition-colors">
                  {c.name.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-5xl sm:text-7xl text-metallic tracking-widest leading-none">WEAR OUT</h2>
        <p className="text-gold tracking-[0.4em] uppercase mt-4 text-sm sm:text-base">Wear Your Confidence</p>
        <Link to="/shirts" className="btn-gold inline-block mt-8">
          Start Shopping
        </Link>
      </section>
    </div>
  );
}
