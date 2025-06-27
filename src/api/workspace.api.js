import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListWorkspaceApi = async (params) =>
  axiosInstance.get(endpoints.workspace.list, { params });
