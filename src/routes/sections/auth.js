import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const LoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const VerifyOtpPage = lazy(() => import('src/pages/auth/jwt/otp'));

// ----------------------------------------------------------------------

const authJwt = {
  path: '/',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout
          sx={{
            width: { xs: 420, lg: 500 },
            p: 4,
            pt: 2.5,
            overflow: 'unset',
          }}
          title={
            <Typography variant="h4" color="primary" mb={6}>
              SignIn to MKTLogin CMS
            </Typography>
          }
        >
          <LoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'verify-otp',
      element: (
        <AuthClassicLayout
          sx={{
            width: { xs: 420, lg: 500 },
            overflow: 'unset',
          }}
        >
          <VerifyOtpPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [authJwt];
