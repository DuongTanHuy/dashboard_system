import axiosInstance, { endpoints } from 'src/utils/axios';

export const getStatisticSummaryApi = (params) =>
  axiosInstance.get(endpoints.statistic.summary, { params });

export const getStatisticChartApi = (params) =>
  axiosInstance.get(endpoints.statistic.chart, { params });

export const getAffiliateSummaryApi = (params) =>
  axiosInstance.get(endpoints.affiliate.summary, { params });

export const getAffiliateChartApi = (params) =>
  axiosInstance.get(endpoints.affiliate.chart, { params });
