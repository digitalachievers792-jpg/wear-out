// Shared helpers so the app works both in dev (Vite proxy) and in production
// (when VITE_API_BASE points at the deployed backend, e.g. https://wearout-backend.onrender.com).
export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function imgUrl(image) {
  if (!image) return '/assets/hero/figure.svg';
  if (image.startsWith('http')) return image;
  return `${API_BASE}/uploads/${image}`;
}
