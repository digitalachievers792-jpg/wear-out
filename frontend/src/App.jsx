import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Category from './pages/Category';
import ComingSoon from './pages/ComingSoon';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import ReviewsModeration from './pages/admin/ReviewsModeration';
import CourierHub from './pages/admin/CourierHub';
import Logistics from './pages/admin/Logistics';
import Analytics from './pages/admin/Analytics';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuth';
import { ConfigProvider } from './context/ConfigContext';

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <AdminAuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shirts" element={<Category />} />
                <Route path="/trousers" element={<Category />} />
                <Route path="/caps" element={<Category />} />
                <Route path="/unstitch" element={<Category />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watches" element={<ComingSoon category="Watches" />} />
                <Route path="/accessories" element={<ComingSoon category="Accessories" />} />
                <Route path="/shoes" element={<ComingSoon category="Shoes" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reviews" element={<ReviewsModeration />} />
                  <Route path="courier" element={<CourierHub />} />
                  <Route path="logistics" element={<Logistics />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </AdminAuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
