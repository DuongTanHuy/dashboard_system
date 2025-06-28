import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  user: icon('ic_user'),
  cms_user: icon('ic_user_cms'),
  bank: icon('ic_banking'),
  approve: icon('ic_approve'),
  profile: icon('ic_profile'),
  profile_group: icon('ic_profile_group'),
  statistical: icon('ic_analytics'),
  workspace: icon('ic_workspace'),
  banner: icon('ic_banner'),
  device: icon('ic_device'),
  affiliate: icon('ic_affiliate'),
  user_activity: icon('ic_user_activity'),
  permission: icon('ic_permission'),
  setting: icon('ic_setting'),
  voucher: icon('ic_voucher'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();
  const isEmployee = user?.role === 'employee';
  const isApprover = user?.role === 'approver';

  const data = useMemo(
    () => [
      {
        // subheader: 'MKTLogin CMS v1.0.0',
        items: isApprover
          ? [
              {
                title: 'Phê duyệt script',
                path: paths.dashboard.script.approve,
                icon: ICONS.approve,
              },
            ]
          : [
              ...(!isEmployee
                ? [
                    {
                      title: 'Thống kê',
                      path: paths.dashboard.statistical.root,
                      icon: ICONS.statistical,
                      children: [
                        { title: 'Doanh thu', path: paths.dashboard.statistical.revenue },
                        { title: 'Affiliate', path: paths.dashboard.statistical.affiliate },
                      ],
                    },
                  ]
                : []),
              {
                title: 'Quản lý tài khoản app',
                path: paths.dashboard.user_manager,
                icon: ICONS.user,
              },
              {
                title: 'Quản lý tài khoản cms',
                path: paths.dashboard.cms_user,
                icon: ICONS.cms_user,
              },
              {
                title: 'Lịch sử giao dịch',
                path: paths.dashboard.transaction_history.root,
                icon: ICONS.bank,
                children: [
                  { title: 'Nạp tiền', path: paths.dashboard.transaction_history.recharge },
                  { title: 'Trừ tiền', path: paths.dashboard.transaction_history.deduction },
                  { title: 'Mua gói', path: paths.dashboard.transaction_history.buy_package },
                  { title: 'Ngân hàng', path: paths.dashboard.transaction_history.banking },
                ],
              },
              ...(!isEmployee
                ? [
                    {
                      title: 'Quản lý voucher',
                      path: paths.dashboard.voucher.root,
                      icon: ICONS.voucher,
                    },
                    {
                      title: 'Quản lý script',
                      path: paths.dashboard.script.root,
                      icon: ICONS.approve,
                      children: [
                        {
                          title: 'Script của người dùng',
                          path: paths.dashboard.script.list,
                        },
                        {
                          title: 'Phê duyệt script',
                          path: paths.dashboard.script.approve,
                        },
                      ],
                    },
                    {
                      title: 'Quản lý hồ sơ',
                      path: paths.dashboard.profile.list,
                      icon: ICONS.profile,
                    },
                  ]
                : []),
            ],
      },
    ],
    [isApprover, isEmployee]
  );

  return data;
}
