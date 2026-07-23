import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/app/auth';
import { ROUTES } from '@/constants/routes';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.root} replace />;
  return <Outlet />;
}
