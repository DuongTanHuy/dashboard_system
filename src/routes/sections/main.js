import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/404'));
const Page500 = lazy(() => import('src/pages/500'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <CompactLayout>
        <Outlet />
      </CompactLayout>
    ),
    children: [
      { path: '404', element: <Page404 /> },

      { path: '500', element: <Page500 /> },
    ],
  },
];
