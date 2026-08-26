import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import { useState, useEffect } from 'react';
import { imgUrl } from '../lib/img';

export default function Cart() {
  const { items, updateQty, removeItem, total, clear } = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(0);

  useEffect(() => {
    api.getConfig().then((c) => setDelivery(c.deliveryCharge || 0)).catch(() => setDelivery(0));
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-metallic">YOUR CART</h1>
        <p className="text-slate-500 mt-4">Nothing here yet.</p>
        <Link to="/shirts" className="btn-gold inline-block mt-6">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-metallic mb-8">YOUR CART</h1>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.product + it.size} className="flex flex-wrap items-center gap-4 bg-white border border-gold/20 rounded-lg p-3 shadow-sm">
            <img src={imgUrl(it.image)} alt={it.name} className="h-20 w-16 object-cover rounded" />
            <div className="flex-1 min-w-[140px]">
              <p className="text-slate-800 font-semibold">{it.name}</p>
              <p className="text-slate-400 text-sm">Size: {it.size}</p>
              <p className="text-gold text-sm">Rs {it.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 rounded border border-gold/30 text-slate-800 hover:border-gold"
                  onClick={() => updateQty(it.product, it.size, it.quantity - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-slate-800">{it.quantity}</span>
                <button
                  className="h-8 w-8 rounded border border-gold/30 text-slate-800 hover:border-gold"
                  onClick={() => updateQty(it.product, it.size, it.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button className="text-red-400 text-sm" onClick={() => removeItem(it.product, it.size)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gold/20 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-600 mt-1">
          <span>Delivery (prepaid)</span>
          <span>Rs {delivery.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-800 font-semibold text-lg mt-3 border-t border-gold/20 pt-3">
          <span>Total</span>
          <span className="text-gold">Rs {(total + delivery).toLocaleString()}</span>
        </div>
        <button className="btn-gold w-full mt-5" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
