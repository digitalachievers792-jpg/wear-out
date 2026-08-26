const mongoose = require('mongoose');

// Courier / delivery partner connection records.
// Available couriers are seeded on first boot; the `connected` flag and any
// future API credentials are persisted here.
const courierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    connected: { type: Boolean, default: false },
    credentials: { type: Object, default: {} }, // reserved for real API keys later
  },
  { timestamps: true }
);

module.exports = mongoose.model('Courier', courierSchema);
