import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || '/api';
const client = axios.create({ baseURL: BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('wearout_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  // public config
  getConfig: () => client.get('/admin/config').then((r) => r.data),

  // products
  getProducts: (params = {}) => client.get('/products', { params }).then((r) => r.data),
  getProduct: (id) => client.get(`/products/${id}`).then((r) => r.data),

  // orders
  createOrder: (payload) => client.post('/orders', payload).then((r) => r.data),

  // reviews
  submitReview: (payload) => client.post('/reviews', payload).then((r) => r.data),
  getApprovedReviews: (productId) => client.get(`/reviews/product/${productId}`).then((r) => r.data),
  getProductRating: (productId) => client.get(`/reviews/product/${productId}/rating`).then((r) => r.data),

  // admin auth
  login: (email, password) => client.post('/admin/login', { email, password }).then((r) => r.data),
  me: () => client.get('/admin/me').then((r) => r.data),

  // admin products
  createProduct: (formData) =>
    client.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  updateProduct: (id, formData) =>
    client.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  deleteProduct: (id) => client.delete(`/products/${id}`).then((r) => r.data),

  // admin orders
  getOrders: (params = {}) => client.get('/orders', { params }).then((r) => r.data),
  updateOrderStatus: (id, status, courier) =>
    client.put(`/orders/${id}/status`, { status, courier }).then((r) => r.data),

  // admin reviews
  getPendingReviews: () => client.get('/reviews/pending').then((r) => r.data),
  setReviewStatus: (id, status) => client.put(`/reviews/${id}/status`, { status }).then((r) => r.data),
  deleteReview: (id) => client.delete(`/reviews/${id}`).then((r) => r.data),

  // analytics
  getDashboard: (month, year) => client.get('/analytics/dashboard', { params: { month, year } }).then((r) => r.data),
  getCustomers: () => client.get('/analytics/customers').then((r) => r.data),
  getLogistics: (month, year) => client.get('/analytics/logistics', { params: { month, year } }).then((r) => r.data),

  // courier
  getCouriers: () => client.get('/courier/couriers').then((r) => r.data),
  toggleCourier: (id) => client.post(`/courier/couriers/${id}/toggle`).then((r) => r.data),
  getOptimizer: () => client.get('/courier/optimizer').then((r) => r.data),
};

export default api;
