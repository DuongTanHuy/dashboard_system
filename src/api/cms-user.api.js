import { useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export function useGetCmsUserAPi() {
  const URL = endpoints.cms_user.list;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchUserList = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      userList: data?.data || [],
      userListLoading: isLoading || isRefetching,
      userListError: error,
      userListValidating: isValidating,
      refetchUserList,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchUserList]
  );

  return memoizedValue;
}

export const getListCmsUserApi = async () => axiosInstance.get(endpoints.cms_user.list);

export const createCmsUserApi = async (payload) =>
  axiosInstance.post(endpoints.cms_user.create, payload);

export const updateCmsUserApi = async (userId, payload) =>
  axiosInstance.put(endpoints.cms_user.update(userId), payload);

export const deleteCmsUserApi = async (userId) =>
  axiosInstance.delete(endpoints.cms_user.delete(userId));
