import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListUserActivityApi = async (params, signal) =>
  axiosInstance.get(endpoints.user_activity.list, { params, ...(signal && { signal }) });

export const getDataExtraUserActivityApi = async (id) =>
  axiosInstance.get(endpoints.user_activity.data_extra(id));
