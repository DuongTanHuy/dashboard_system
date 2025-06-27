import axiosInstance, { endpoints } from 'src/utils/axios';

export const getListKernelVersionApi = () => axiosInstance.get(endpoints.kernel_version.list);
