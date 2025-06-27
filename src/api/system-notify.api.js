import { useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export function useGetSystemNotifyAPi() {
  const URL = endpoints.system_notify.list;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchSystemNotify = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      systemNotify: data?.data || [],
      systemNotifyLoading: isLoading || isRefetching,
      systemNotifyError: error,
      systemNotifyValidating: isValidating,
      refetchSystemNotify,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchSystemNotify]
  );

  return memoizedValue;
}

export const createSystemNotifyApi = async (payload) =>
  axiosInstance.post(endpoints.system_notify.create, payload);

export const deleteSystemNotifyApi = async (notifyId) =>
  axiosInstance.delete(endpoints.system_notify.delete(notifyId));

export const updateSystemNotifyApi = async (notifyId, payload) =>
  axiosInstance.put(endpoints.system_notify.update(notifyId), payload);

export const getSystemNotifyDetailApi = async (notifyId) =>
  axiosInstance.get(endpoints.system_notify.detail(notifyId));
