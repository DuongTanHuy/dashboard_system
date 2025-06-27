import { useCallback, useMemo, useState } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
import { OPTIONS_FETCH } from 'src/utils/constance';
import useSWR, { mutate } from 'swr';

export function useProfilePackageAPi() {
  const URL = endpoints.profile_package.list;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, OPTIONS_FETCH);

  const refetchProfilePackage = useCallback(async () => {
    setIsRefetching(true);
    await mutate(URL);
    setIsRefetching(false);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      profilePackage: data || [],
      profilePackageLoading: isLoading || isRefetching,
      profilePackageError: error,
      profilePackageValidating: isValidating,
      refetchProfilePackage,
    }),
    [data, error, isLoading, isRefetching, isValidating, refetchProfilePackage]
  );

  return memoizedValue;
}
