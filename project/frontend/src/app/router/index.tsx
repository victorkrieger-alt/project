import { createBrowserRouter, Navigate } from 'react-router-dom';
import Auth from '@/features/auth/pages/Auth';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import Alunos from '@/features/alunos/pages/Alunos';
import Agenda from '@/features/agenda/pages/Agenda';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { ROUTES } from '@/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <Auth />,
  },
  {
    path: ROUTES.resetPassword,
    element: <ResetPassword />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.dashboard, element: <Dashboard /> },
          { path: ROUTES.alunos, element: <Alunos /> },
          { path: ROUTES.agenda, element: <Agenda /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.root} replace />,
  },
]);
