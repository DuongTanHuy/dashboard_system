import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';
import { clearSession, clearStorage } from 'src/hooks/use-local-storage';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      clearStorage();
      clearSession();
      window.location.href = paths.auth.jwt.login;
      return false;
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, {
    baseURL: HOST_API,
  });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/v1/account/me',
    login: '/api/v1/account/login',
    logout: '/api/v1/account/logout',
    verify_otp: '/api/v1/account/otp/verify',
    refresh_token: '/api/v1/token/refresh',
    resend_otp: '/api/v1/account/otp/resend',
    change_password: '/api/v1/account/change-password',
  },
  user: {
    list: '/api/v1/users',
    updateBalance: (userId) => `/api/v1/users/${userId}/balance`,
    updateReferer: (userId) => `/api/v1/users/${userId}/referer`,
    update_package: (userId) => `/api/v1/users/${userId}/upgrade-profile-package`,
    update_user: (userId) => `/api/v1/users/${userId}`,
  },
  cms_user: {
    list: '/api/v1/cms-user/list',
    create: '/api/v1/cms-user/create',
    update: (userId) => `/api/v1/cms-user/update/${userId}`,
    delete: (userId) => `/api/v1/cms-user/delete/${userId}`,
  },
  banner: {
    list: '/api/v1/banners',
    create: '/api/v1/banners',
    update: (bannerId) => `/api/v1/banners/${bannerId}`,
    delete: (bannerId) => `/api/v1/banners/${bannerId}`,
  },
  transaction_history: {
    list: '/api/v1/transaction-histories',
    banking: '/api/v1/banking-transactions',
    delete: (transactionId) => `/api/v1/transaction-histories/${transactionId}`,
  },
  public_workflow: {
    list: '/api/v1/public-workflows',
    detail: (id) => `/api/v1/public-workflows/${id}`,
    approve: (id) => `/api/v1/public-workflows/${id}/approve`,
    reject: (id) => `/api/v1/public-workflows/${id}/reject`,
    delete: (id) => `/api/v1/public-workflows/${id}/remove`,
    category: '/api/v1/workflow-categories',
    shareWorkflow: (id) => `/api/v1/public-workflows/${id}/generate-activation-code`,
  },
  workflow: {
    list: '/api/v1/workflows',
    detail: (workspaceId) => `/api/v1/workflows/${workspaceId}`,
    shareWorkflow: (id) => `/api/v1/workflows/${id}/generate-activation-code`,
  },
  kernel_version: {
    list: '/api/v1/kernel-versions',
  },
  profile: {
    list: '/api/v1/profiles',
    detail: (profileId) => `/api/v1/profiles/${profileId}`,
    update: (profileId) => `/api/v1/profiles/${profileId}`,
    delete: '/api/v1/profiles/remove',
    restore: '/api/v1/profiles/restore',
    transfer: '/api/v1/profiles/transfer',
  },
  profile_group: {
    list: '/api/v1/profile-groups',
  },
  device: {
    list: '/api/v1/devices',
    logout: '/api/v1/devices/logout',
  },
  statistic: {
    summary: '/api/v1/statistics',
    chart: '/api/v1/statistics-chart',
  },
  system_config: {
    get: '/api/v1/system-configs',
    update: '/api/v1/system-configs',
  },
  system_notify: {
    list: '/api/v1/system-notifications',
    create: '/api/v1/system-notifications',
    delete: (notifyId) => `/api/v1/system-notifications/${notifyId}`,
    update: (notifyId) => `/api/v1/system-notifications/${notifyId}`,
    detail: (notifyId) => `/api/v1/system-notifications/${notifyId}`,
  },
  profile_package: {
    list: '/api/v1/profile-packages',
  },
  workspace: {
    list: '/api/v1/workspaces',
  },
  affiliate: {
    list: '/api/v1/affiliate-users',
    summary: '/api/v1/affiliate/statistics',
    chart: '/api/v1/affiliate/statistics-chart',
  },
  user_activity: {
    list: '/api/v1/user-activities',
    data_extra: (id) => `/api/v1/user-activities/${id}/extra-data`,
  },
  reconciliation: {
    list: '/api/v1/reconciliations',
    detail: (reconciliationId) => `/api/v1/reconciliations/${reconciliationId}`,
    commissionPayment: (reconciliationId) => `/api/v1/reconciliations/${reconciliationId}/pay`,
  },
  commissionFee: {
    list: '/api/v1/commissions',
  },
  permission: {
    list: '/api/v1/work-permissions',
    create: '/api/v1/work-permissions',
    update: (permissionId) => `/api/v1/work-permissions/${permissionId}`,
    delete: (permissionId) => `/api/v1/work-permissions/${permissionId}`,
  },
  voucher: {
    list: '/api/v1/vouchers',
    create: '/api/v1/vouchers',
    update: (voucherId) => `/api/v1/vouchers/${voucherId}`,
    delete: (voucherId) => `/api/v1/vouchers/${voucherId}`,
  },
};
