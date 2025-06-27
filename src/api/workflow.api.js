import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR from 'swr';

export const getListPublicWorkflowApi = async (params) =>
  axiosInstance.get(endpoints.public_workflow.list, { params });

export const getListWorkflowApi = async (params, signal) =>
  axiosInstance.get(endpoints.workflow.list, {
    params,
    ...(signal && { signal }),
  });

export const approvePublicWorkflowApi = async (id) =>
  axiosInstance.post(endpoints.public_workflow.approve(id));

export const rejectPublicWorkflowApi = async (id, payload) =>
  axiosInstance.post(endpoints.public_workflow.reject(id), payload);

export function useGetPublishWorkflowDetail(workflowId) {
  const url = workflowId ? endpoints.public_workflow.detail(workflowId) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, OPTIONS_FETCH);

  const memoizedValue = useMemo(
    () => ({
      workflow: data || {},
      workflowLoading: isLoading,
      workflowError: error,
      workflowValidating: isValidating,
      reload: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetWorkflowDetail(workflowId) {
  const url = workflowId ? endpoints.workflow.detail(workflowId) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, OPTIONS_FETCH);

  const memoizedValue = useMemo(
    () => ({
      workflow: data || {},
      workflowLoading: isLoading,
      workflowError: error,
      workflowValidating: isValidating,
      reload: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const deletePublicWorkflowApi = async (workflowId) =>
  axiosInstance.post(endpoints.public_workflow.delete(workflowId));

export const sharePublishWorkflow = async (workflowId, params) =>
  axiosInstance.post(endpoints.public_workflow.shareWorkflow(workflowId), params);

export const shareWorkflow = async (workflowId, params) =>
  axiosInstance.post(endpoints.workflow.shareWorkflow(workflowId), params);

export const useGetCategoryList = () => {
  const url = endpoints.public_workflow.category;

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, OPTIONS_FETCH);

  const memoizedValue = useMemo(
    () => ({
      category: data || [],
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
      reload: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
};
