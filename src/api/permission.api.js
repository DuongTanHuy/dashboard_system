import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListPermissionApi = async (params) =>
  axiosInstance.get(endpoints.permission.list, { params });

export const createPermissionApi = async (payload) =>
  axiosInstance.post(endpoints.permission.create, payload);

export const updatePermissionApi = async (permissionId, payload) =>
  axiosInstance.put(endpoints.permission.update(permissionId), payload);

export const deletePermissionApi = async (permissionId) =>
  axiosInstance.delete(endpoints.permission.delete(permissionId));
