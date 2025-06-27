import axiosInstance, { endpoints } from 'src/utils/axios';

export const getTransactionHistoryApi = async (params) =>
  axiosInstance.get(endpoints.transaction_history.list, { params });

export const getBankingTransactionHistoryApi = async (params) =>
  axiosInstance.get(endpoints.transaction_history.banking, { params });

export const deleteTransactionHistoryApi = async (transactionId) =>
  axiosInstance.delete(endpoints.transaction_history.delete(transactionId));
