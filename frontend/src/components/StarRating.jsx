// Fractional star rating display (0–5, supports halves).
export default function StarRating({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className={`relative inline-block leading-none text-base ${className}`} aria-label={`${value} out of 5`}>
      <span className="text-slate-300">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden text-gold" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}
