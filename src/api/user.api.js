import { useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export const getListUserApi = async (params) => axiosInstance.get(endpoints.user.list, { params });

export function useGetUserAPi() {
  const URL = endpoints.user.list;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchUserList = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      userList: data || [],
      userListLoading: isLoading || isRefetching,
      userListError: error,
      userListValidating: isValidating,
      refetchUserList,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchUserList]
  );

  return memoizedValue;
}

export const updateUserBalanceApi = async (userId, payload) =>
  axiosInstance.post(endpoints.user.updateBalance(userId), payload);

export const updateRefererApi = async (userId, payload) =>
  axiosInstance.post(endpoints.user.updateReferer(userId), payload);

export const updateUserEmailApi = async (userId, payload) =>
  axiosInstance.put(endpoints.user.update_user(userId), payload);

export const updateProfilePackageApi = async (userId, payload) =>
  axiosInstance.post(endpoints.user.update_package(userId), payload);
