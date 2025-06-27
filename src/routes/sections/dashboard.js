import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import MainLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const UserManagePage = lazy(() => import('src/pages/user-page'));
const CmsUserPage = lazy(() => import('src/pages/cms-user-page'));
const AccountSettingPage = lazy(() => import('src/pages/account-setting-page'));
const RechargePage = lazy(() => import('src/pages/transaction/recharge-page'));
const DeductionPage = lazy(() => import('src/pages/transaction/deduction-page'));
const BuyPackagePage = lazy(() => import('src/pages/transaction/buy-package-page'));
const BankingPage = lazy(() => import('src/pages/transaction/banking-page'));
const ApproveScriptPage = lazy(() => import('src/pages/manage-script/approve'));
const ListScriptPage = lazy(() => import('src/pages/manage-script/list'));
const ScriptApproveDetailPage = lazy(() => import('src/pages/manage-script/approve-detail'));
const ScriptListDetailPage = lazy(() => import('src/pages/manage-script/list-detail'));
const PublishVariableInterfacePage = lazy(() =>
  import('src/pages/manage-script/publish-variable-interface')
);
const VariableInterfacePage = lazy(() => import('src/pages/manage-script/variable-interface'));
const ListProfilePage = lazy(() => import('src/pages/profile/list'));
const EditProfilePage = lazy(() => import('src/pages/profile/edit'));
const RevenueStatisticalPage = lazy(() => import('src/pages/revenue-statistical-page'));
const AffiliateStatisticalPage = lazy(() => import('src/pages/affiliate-statistical-page'));
const VoucherManagementPage = lazy(() => import('src/pages/voucher-management'));

// ----------------------------------------------------------------------

export const DashboardRoutes = () => {
  const { user } = useAuthContext();
  const isPermission = user?.role === 'super_admin';
  const isEmployee = user?.role === 'employee';
  const isApprover = user?.role === 'approver';

  return [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        </AuthGuard>
      ),
      children: isApprover
        ? [
            {
              path: 'script-management/',
              children: [
                { element: <ApproveScriptPage />, index: true },
                { path: 'approve', element: <ApproveScriptPage /> },
              ],
            },
          ]
        : [
            { path: 'user-manage', element: <UserManagePage /> },
            { path: 'cms-user', element: <CmsUserPage /> },
            { path: 'account-setting', element: <AccountSettingPage /> },
            {
              path: 'transaction-history/',
              children: [
                { element: <RechargePage />, index: true },
                { path: 'recharge', element: <RechargePage /> },
                { path: 'deduction', element: <DeductionPage /> },
                { path: 'buy-package', element: <BuyPackagePage /> },
                { path: 'banking', element: <BankingPage /> },
              ],
            },
            ...(!isEmployee
              ? [
                  {
                    path: '/voucher-management',
                    element: <VoucherManagementPage />,
                  },
                  {
                    path: 'script-management/',
                    children: [
                      { element: <ListScriptPage />, index: true },
                      { path: 'list', element: <ListScriptPage /> },
                      { path: 'approve', element: <ApproveScriptPage /> },
                    ],
                  },
                  {
                    path: 'profile-management/',
                    children: [
                      { element: <ListProfilePage />, index: true },
                      { path: 'list', element: <ListProfilePage /> },
                    ],
                  },

                  {
                    path: 'statistical/',
                    children: [
                      { element: <RevenueStatisticalPage />, index: true },
                      { path: 'revenue', element: <RevenueStatisticalPage /> },
                      { path: 'affiliate', element: <AffiliateStatisticalPage /> },
                    ],
                  },
                ]
              : []),
            // ...(!isEmployee ? [] : []),
            // ...(isPermission ? [] : []),
          ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout
            sx={{
              pb: 0,
              px: 0,
            }}
          >
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        </AuthGuard>
      ),
      children: [
        ...(!isEmployee
          ? [
              {
                path: 'script-management/approve/detail/:scriptId',
                element: <ScriptApproveDetailPage />,
              },
              {
                path: 'script-management/publish-variable-interface/:scriptId',
                element: <PublishVariableInterfacePage />,
              },
              ...(!isApprover
                ? [
                    {
                      path: 'script-management/list/detail/:scriptId',
                      element: <ScriptListDetailPage />,
                    },
                    {
                      path: 'script-management/variable-interface/:scriptId',
                      element: <VariableInterfacePage />,
                    },
                  ]
                : []),
            ]
          : []),
        ...(isPermission
          ? [{ path: '/profile-management/edit/:profileId', element: <EditProfilePage /> }]
          : []),
      ],
    },
  ];
};
