// Shared helpers so the app works both in dev (Vite proxy) and in production
// (when VITE_API_BASE points at the deployed backend, e.g. https://wear-out.onrender.com).
export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function imgUrl(image) {
  if (!image) return '/assets/hero/figure.svg';
  // Cloudinary full URL — use directly
  if (image.startsWith('http')) return image;
  // Legacy local filename — construct backend URL
  return `${API_BASE}/uploads/${image}`;
}
