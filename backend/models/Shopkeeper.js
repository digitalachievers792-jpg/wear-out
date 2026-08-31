const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shopkeeperSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    city: { type: String, default: '' },
    address: { type: String, default: '' },
    cnic: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    role: { type: String, default: 'shopkeeper' },
  },
  { timestamps: true }
);

shopkeeperSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

shopkeeperSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

shopkeeperSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Shopkeeper', shopkeeperSchema);
