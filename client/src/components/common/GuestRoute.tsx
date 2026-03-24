import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}
