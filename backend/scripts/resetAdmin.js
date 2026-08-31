const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const uri = process.env.MONGO_URI;
const email = process.env.ADMIN_EMAIL || 'admin@wearout.store';
const password = process.env.ADMIN_PASSWORD || 'wearout123';

(async () => {
  await mongoose.connect(uri);
  const hash = await bcrypt.hash(password, 12);
  const admin = await Admin.findOneAndUpdate(
    { email },
    { passwordHash: hash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('Admin ready ->', admin.email);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
