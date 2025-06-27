import axiosInstance, { endpoints } from 'src/utils/axios';

export const getAuthInfoApi = () => axiosInstance.get(endpoints.auth.me);

export const reSendOtpApi = (payload) => axiosInstance.post(endpoints.auth.resend_otp, payload);

export const changePasswordApi = (payload) =>
  axiosInstance.put(endpoints.auth.change_password, payload);

export const logoutApi = () => axiosInstance.post(endpoints.auth.logout);
