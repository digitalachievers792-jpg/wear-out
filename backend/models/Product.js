const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    // multiple selectable size options per product
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'At least one size is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Shirts', 'Trousers', 'Caps', 'Watches', 'Accessories', 'Shoes', 'Un Stitch'],
    },
    // owner-set star rating (0–5, allows halves)
    rating: { type: Number, default: 0, min: 0, max: 5 },
    image: { type: String, default: '' }, // stored filename in /uploads/products
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
