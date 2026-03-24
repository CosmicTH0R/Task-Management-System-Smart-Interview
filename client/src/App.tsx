import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getMe } from '@/api/auth.api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import GuestRoute from '@/components/common/GuestRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Placeholder pages — replaced in Phase 9/10
function DashboardIndex() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Dashboard coming soon (Phase 9)</p>
    </div>
  );
}
function AnalyticsIndex() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Analytics coming soon (Phase 10)</p>
    </div>
  );
}
function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">404 — Page not found</h1>
    </div>
  );
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    getMe()
      .then((user) => setUser(user))
      .catch(() => logout());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      {/* Guest-only routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

      {/* Protected routes with dashboard layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardIndex />} />
        <Route path="/analytics" element={<AnalyticsIndex />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
