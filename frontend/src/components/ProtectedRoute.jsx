import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuth';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
