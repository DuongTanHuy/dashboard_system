import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListDeviceApi = async (params, signal) =>
  axiosInstance.get(endpoints.device.list, { params, ...(signal && { signal }) });

export const logoutDeviceApi = async (payload) =>
  axiosInstance.post(endpoints.device.logout, payload);
