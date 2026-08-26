import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { imgUrl } from '../lib/img';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white border border-gold/20 rounded-xl overflow-hidden hover:border-gold/60 transition-colors shadow-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={imgUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display tracking-wide text-lg text-slate-800 group-hover:text-gold transition-colors truncate">
          {product.name}
        </h3>
        {product.rating > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={product.rating} />
            <span className="text-xs text-slate-400">{Number(product.rating).toFixed(1)}</span>
          </div>
        )}
        <p className="text-gold font-semibold mt-1">Rs {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
