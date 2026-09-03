export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function imgUrl(image) {
  if (!image) return '/assets/hero/figure.svg';
  if (image.startsWith('http')) return image;
  return `${API_BASE}/uploads/${image}`;
}

export function getProductImages(product) {
  if (product.images && product.images.length > 0) return product.images;
  if (product.image) return [product.image];
  return [];
}
