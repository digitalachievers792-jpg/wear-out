// Smoke test: exercises the live API end-to-end.
// Run backend first (npm run dev) and `npm run dev:db`.
const BASE = 'http://localhost:5000/api';

async function main() {
  const log = (...a) => console.log('•', ...a);
  let pass = 0, fail = 0;
  const ok = (cond, label) => { if (cond) { pass++; log('PASS', label); } else { fail++; console.error('FAIL', label); } };

  // health
  let r = await fetch(`${BASE}/admin/config`);
  ok(r.status === 200, 'public config reachable');

  // protected route rejects unauthenticated
  r = await fetch(`${BASE}/products`, { method: 'POST' });
  ok(r.status === 401, 'create product blocked without token');

  // login
  r = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@wearout.store', password: process.env.ADMIN_PASSWORD || 'wearout123' }),
  });
  ok(r.status === 200, 'admin login succeeds');
  const { token } = await r.json();
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // create product
  r = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'Test Shirt', price: 1500, category: 'Shirts', sizes: ['S', 'M', 'L'], description: 'demo' }),
  });
  ok(r.status === 201, 'product created');
  const product = await r.json();

  // get products
  r = await fetch(`${BASE}/products?category=Shirts`);
  const prods = await r.json();
  ok(Array.isArray(prods) && prods.length >= 1, 'product listed');

  // create order
  r = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Test User', age: 25, city: 'Karachi', address: '123 St', whatsapp: '923001234567', email: 't@t.com', gender: 'Male' },
      items: [{ product: product._id, size: 'M', quantity: 2 }],
      deliveryCharge: 200,
    }),
  });
  ok(r.status === 201, 'order created');
  const order = await r.json();

  // invalid phone rejected
  r = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'X', age: 25, city: 'K', address: 'A', whatsapp: 'abc', email: 't@t.com', gender: 'Male' },
      items: [{ product: product._id, size: 'M', quantity: 1 }],
      deliveryCharge: 200,
    }),
  });
  ok(r.status === 400, 'invalid phone rejected');

  // admin sees order
  r = await fetch(`${BASE}/orders`, { headers });
  const orders = await r.json();
  ok(orders.some((o) => o._id === order.order._id), 'admin order list contains order');

  // update status
  r = await fetch(`${BASE}/orders/${order.order._id}/status`, {
    method: 'PUT', headers, body: JSON.stringify({ status: 'Completed', courier: 'TCS' }),
  });
  ok(r.status === 200, 'order status updated');

  // review submit + pending
  r = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: product._id, rating: 5, comment: 'Great <script>alert(1)</script> fit' }),
  });
  ok(r.status === 201, 'review submitted');
  r = await fetch(`${BASE}/reviews/pending`, { headers });
  const pending = await r.json();
  ok(pending.length >= 1, 'review appears pending');

  // analytics has data
  r = await fetch(`${BASE}/analytics/dashboard`, { headers });
  const dash = await r.json();
  ok(dash.total >= 1, 'dashboard reflects orders');

  r = await fetch(`${BASE}/analytics/logistics`, { headers });
  const logi = await r.json();
  ok(logi.hasData === true, 'logistics has data');

  // couriers
  r = await fetch(`${BASE}/courier/couriers`, { headers });
  const couriers = await r.json();
  ok(couriers.length >= 1, 'couriers listed');

  // cleanup
  await fetch(`${BASE}/products/${product._id}`, { method: 'DELETE', headers });
  await fetch(`${BASE}/orders/${order.order._id}`, { method: 'DELETE', headers }).catch(() => {});

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
