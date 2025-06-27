import { useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export const getListProfileApi = async (params, signal) =>
  axiosInstance.get(endpoints.profile.list, {
    params,
    ...(signal && { signal }),
  });

export function useGetDetailProfileAPi(profileId) {
  const URL = profileId ? endpoints.profile.detail(profileId) : null;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchProfileDetail = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      profileDetail: data || {},
      profileDetailLoading: isLoading || isRefetching,
      profileDetailError: error,
      profileDetailValidating: isValidating,
      refetchProfileDetail,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchProfileDetail]
  );

  return memoizedValue;
}

export const updateProfileApi = async (profileId, payload) =>
  axiosInstance.put(endpoints.profile.update(profileId), payload);

export const deleteProfileApi = async (payload) =>
  axiosInstance.delete(endpoints.profile.delete, { data: payload });

export const restoreProfileApi = async (payload) =>
  axiosInstance.put(endpoints.profile.restore, payload);

export const transferProfileApi = async (payload) =>
  axiosInstance.post(endpoints.profile.transfer, payload);
