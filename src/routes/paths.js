// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/',
  DASHBOARD: '/',
  TRANSACTION_HISTORY: `/transaction-history/`,
  APPROVE_SCRIPT: `/script-management/`,
  PROFILE: `/profile-management/`,
  PROFILE_GROUP: `/profile-group-management`,
  STATISTICAL: `/statistical/`,
  WORKSPACE: `/workspace-management`,
  BANNER: `/banner-management`,
  DEVICE: `/device-management`,
  AFFILIATE: `/affiliate-management/`,
  PERMISSION: `/permission-management`,
  VOUCHER: `/voucher-management`,
  SETTING: `/setting`,
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}login`,
      verify_otp: `${ROOTS.AUTH}verify-otp`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}user-manage`,
    cms_user: `${ROOTS.DASHBOARD}cms-user`,
    user_activity: `${ROOTS.DASHBOARD}user-activity`,
    transaction_history: {
      root: ROOTS.TRANSACTION_HISTORY,
      recharge: `${ROOTS.TRANSACTION_HISTORY}recharge`,
      deduction: `${ROOTS.TRANSACTION_HISTORY}deduction`,
      buy_package: `${ROOTS.TRANSACTION_HISTORY}buy-package`,
      banking: `${ROOTS.TRANSACTION_HISTORY}banking`,
    },
    script: {
      root: ROOTS.APPROVE_SCRIPT,
      approve: `${ROOTS.APPROVE_SCRIPT}approve`,
      list: `${ROOTS.APPROVE_SCRIPT}list`,
      listDetail: `${ROOTS.APPROVE_SCRIPT}/list/detail`,
      approveDetail: `${ROOTS.APPROVE_SCRIPT}/approve/detail`,
      detail: `${ROOTS.APPROVE_SCRIPT}detail`,
      variable_interface: `${ROOTS.APPROVE_SCRIPT}variable-interface`,
      publish_variable_interface: `${ROOTS.APPROVE_SCRIPT}publish-variable-interface`,
    },
    profile: {
      root: ROOTS.PROFILE,
      list: `${ROOTS.PROFILE}list`,
      edit: `${ROOTS.PROFILE}edit`,
    },
    profile_group: {
      root: ROOTS.PROFILE_GROUP,
    },
    statistical: {
      root: ROOTS.STATISTICAL,
      revenue: `${ROOTS.STATISTICAL}revenue`,
      affiliate: `${ROOTS.STATISTICAL}affiliate`,
    },
    workspace: {
      root: ROOTS.WORKSPACE,
    },
    banner: {
      root: ROOTS.BANNER,
    },
    device_management: {
      root: ROOTS.DEVICE,
    },
    affiliate: {
      root: ROOTS.AFFILIATE,
      affiliate_user: `${ROOTS.AFFILIATE}affiliate-user`,
      reconciliation: `${ROOTS.AFFILIATE}reconciliation`,
      commission_fee: `${ROOTS.AFFILIATE}commission-fee`,
    },
    permission: {
      root: ROOTS.PERMISSION,
    },
    voucher: {
      root: ROOTS.VOUCHER,
    },
    setting: {
      root: ROOTS.SETTING,
    },
  },
};
