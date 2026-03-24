import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getMe } from '@/api/auth.api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import GuestRoute from '@/components/common/GuestRoute';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Placeholder until Phase 8/9 pages are built
function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard (Coming in Phase 8)</h1>
    </div>
  );
}
function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">404 - Not Found</h1>
    </div>
  );
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  // Auto-login on refresh: verify JWT cookie with server
  useEffect(() => {
    getMe()
      .then((user) => setUser(user))
      .catch(() => logout());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
