// Single source of truth for product categories across the app.
// `slug`  -> route path (/shirts, /unstitch, ...)
// `label` -> display name
// `value` -> stored in the DB (must match the backend category enum)
export const CATEGORIES = [
  { slug: 'shirts', label: 'Shirts', value: 'Shirts' },
  { slug: 'trousers', label: 'Trousers', value: 'Trousers' },
  { slug: 'caps', label: 'Caps', value: 'Caps' },
  { slug: 'watches', label: 'Watches', value: 'Watches' },
  { slug: 'accessories', label: 'Accessories', value: 'Accessories' },
  { slug: 'shoes', label: 'Shoes', value: 'Shoes' },
  { slug: 'unstitch', label: 'Un Stitch', value: 'Un Stitch' },
];

export const categoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug.replace(/^\/+/, ''));
