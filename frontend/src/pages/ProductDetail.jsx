import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';
import StarRating from '../components/StarRating';
import ProductCarousel from '../components/ProductCarousel';
import { getProductImages } from '../lib/img';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-400 p-10">Loading…</p>;
  if (!product) return <p className="text-slate-400 p-10">Product not found.</p>;

  const images = getProductImages(product);

  const handleAdd = () => {
    if (!size) return setError('Please select a size.');
    addItem(product, size, 1);
    setError('');
  };

  const handleBuyNow = () => {
    if (!size) return setError('Please select a size.');
    navigate('/checkout', { state: { buyNow: { product, size, quantity: 1 } } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-slate-100 rounded-xl overflow-hidden border border-gold/20">
          <ProductCarousel images={images} alt={product.name} className="w-full aspect-[3/4]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 rounded">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="text-xs uppercase tracking-wider text-green-700 bg-green-100 border border-green-300 px-2 py-1 rounded">
                ✓ Available in Stock
              </span>
            ) : (
              <span className="text-xs uppercase tracking-wider text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl text-slate-800 mt-4 tracking-wide">{product.name}</h1>
          {product.shopName && (
            <p className="text-sm text-slate-400 mt-1">Sold by <span className="text-gold">{product.shopName}</span></p>
          )}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={product.rating} />
              <span className="text-sm text-slate-400">{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
          <p className="text-gold text-2xl font-semibold mt-2">Rs {product.price.toLocaleString()}</p>
          <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <span className="block text-sm text-slate-500 mb-2 uppercase tracking-wider">Select Size</span>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 rounded-md border text-sm font-semibold transition-colors ${
                    size === s
                      ? 'border-gold bg-gold text-ink'
                      : 'border-gold/30 text-slate-800 hover:border-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button onClick={handleAdd} className="btn-outline flex-1" disabled={!product.inStock}>
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-gold flex-1" disabled={!product.inStock}>
              Buy Now
            </button>
          </div>

          <ul className="mt-8 text-slate-600 text-sm space-y-1">
            <li>• Cash on Delivery — pay product on delivery.</li>
            <li>• Delivery charges paid in advance.</li>
            <li>• Premium quality, bold streetwear fit.</li>
          </ul>
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
}
