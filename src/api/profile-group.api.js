import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListProfileGroupApi = async (params, signal) =>
  axiosInstance.get(endpoints.profile_group.list, { params, ...(signal && { signal }) });
