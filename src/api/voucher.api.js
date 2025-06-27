import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListVoucherApi = async (params) =>
  axiosInstance.get(endpoints.voucher.list, { params });

export const createVoucherApi = async (payload) =>
  axiosInstance.post(endpoints.voucher.create, payload);

export const updateVoucherApi = async (voucherId, payload) =>
  axiosInstance.put(endpoints.voucher.update(voucherId), payload);

export const deleteVoucherApi = async (voucherId) =>
  axiosInstance.delete(endpoints.voucher.delete(voucherId));
