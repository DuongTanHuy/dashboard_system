import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListAffiliateApi = async (params) =>
  axiosInstance.get(endpoints.affiliate.list, { params });

export const getListReconciliationApi = (params) =>
  axiosInstance.get(endpoints.reconciliation.list, { params });

export const getReconciliationDetailApi = (reconciliationId) =>
  axiosInstance.get(endpoints.reconciliation.detail(reconciliationId));

export const commissionPaymentApi = (reconciliationId, payload) =>
  axiosInstance.post(endpoints.reconciliation.commissionPayment(reconciliationId), payload);

export const getCommissionFeeApi = (params) =>
  axiosInstance.get(endpoints.commissionFee.list, { params });
