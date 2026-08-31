import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BrandHero from '../components/BrandHero';
import api from '../api';
import { useConfig } from '../context/ConfigContext';
import { CATEGORIES } from '../categories';

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
          <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-3">
            {realCats.map((c) => {
              const cat = CATEGORIES.find((x) => x.value === c.name);
              const slug = cat ? cat.slug : c.name.toLowerCase();
              return (
                <Link
                  key={c.name}
                  to={`/${slug}`}
                  className="block border-2 border-black rounded-lg px-4 py-3 text-center font-display text-xs sm:text-sm uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  {c.name}
                </Link>
              );
            })}
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
