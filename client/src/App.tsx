import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getMe } from '@/api/auth.api';

// Pages (will be created in Phase 7+)
// Placeholder until pages are built
function LoginPage() {
  return <div className="flex min-h-screen items-center justify-center"><h1 className="text-2xl font-bold">Login</h1></div>;
}
function SignupPage() {
  return <div className="flex min-h-screen items-center justify-center"><h1 className="text-2xl font-bold">Sign Up</h1></div>;
}
function DashboardPage() {
  return <div className="flex min-h-screen items-center justify-center"><h1 className="text-2xl font-bold">Dashboard</h1></div>;
}
function NotFoundPage() {
  return <div className="flex min-h-screen items-center justify-center"><h1 className="text-2xl font-bold">404 - Not Found</h1></div>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  // Auto-login on refresh: verify cookie with server
  useEffect(() => {
    getMe()
      .then((user) => setUser(user))
      .catch(() => logout());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
