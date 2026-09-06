import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminStoreListPage from './pages/admin/AdminStoreListPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';

import StoreListPage from './pages/normal/StoreListPage';

import StoreOwnerDashboardPage from './pages/storeOwner/StoreOwnerDashboardPage';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/store-owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUserListPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
          <Route path="/admin/stores" element={<AdminStoreListPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['NORMAL_USER', 'ADMIN']} />}>
          <Route path="/stores" element={<StoreListPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['STORE_OWNER']} />}>
          <Route path="/store-owner/dashboard" element={<StoreOwnerDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
