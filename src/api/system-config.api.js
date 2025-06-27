import { useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export function useGetSystemConfigAPi() {
  const URL = endpoints.system_config.get;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchSystemConfig = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      systemConfig: data?.data || {},
      systemConfigLoading: isLoading || isRefetching,
      systemConfigError: error,
      systemConfigValidating: isValidating,
      refetchSystemConfig,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchSystemConfig]
  );

  return memoizedValue;
}

export const updateSystemConfigApi = async (payload) =>
  axiosInstance.put(endpoints.system_config.update, payload);
