import { Navigate, useRoutes } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { mainRoutes } from './main';

import { authRoutes } from './auth';
import { DashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuthContext();
  const isEmployee = user?.role === 'employee';

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={isEmployee ? '/user-manage' : PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...DashboardRoutes(),

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
