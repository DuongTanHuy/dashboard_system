import axiosInstance, { endpoints } from 'src/utils/axios';

export const getBannerApi = async (params) =>
  axiosInstance.get(endpoints.banner.list, {
    params,
  });

export const createBannerApi = async (payload) =>
  axiosInstance.post(endpoints.banner.create, payload);

export const updateBannerApi = async (id, payload) =>
  axiosInstance.put(endpoints.banner.update(id), payload);

export const deleteBannerApi = async (id) => axiosInstance.delete(endpoints.banner.delete(id));
