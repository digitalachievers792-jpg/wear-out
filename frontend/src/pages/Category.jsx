import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { categoryBySlug } from '../categories';

export default function Category() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, '');
  const cat = categoryBySlug(slug);
  const label = cat ? cat.label : slug;
  const value = cat ? cat.value : slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({ category: value })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [value]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-metallic tracking-wider mb-2 uppercase">{label}</h1>
      <p className="text-slate-500 mb-8">Premium staples from the Wear Out collection.</p>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
