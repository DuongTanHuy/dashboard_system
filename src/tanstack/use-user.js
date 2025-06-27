import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getListUserApi,
  updateProfilePackageApi,
  updateRefererApi,
  updateUserBalanceApi,
  updateUserEmailApi,
} from 'src/api/user.api';
import QueryKeys from 'src/utils/query-keys';

const useUser = (params, queryOptions) =>
  useQuery({
    queryKey: [QueryKeys.USER_LIST, params],
    queryFn: async () => {
      const response = await getListUserApi(params);
      return response.data;
    },
    refetchOnWindowFocus: true,
    ...queryOptions,
  });

const useUpdateUserReferer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      const response = await updateRefererApi(userId, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.USER_LIST]);
    },
    onError: (error) => {
      console.error('Error updating user referer:', error);
    },
  });
};

const useUpdateUserEmail = () =>
  useMutation({
    mutationFn: async ({ userId, payload }) => {
      await updateUserEmailApi(userId, payload);
    },
    onError: (error) => {
      console.error('Error updating user email:', error);
    },
  });

const useUpdateBalance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      await updateUserBalanceApi(userId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.USER_LIST]);
    },
    onError: (error) => [console.error('Error updating user balance:', error)],
  });
};

const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      await updateProfilePackageApi(userId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.USER_LIST]);
    },
    onError: (error) => {
      console.error('Error updating user package:', error);
    },
  });
};

export { useUser, useUpdateUserReferer, useUpdateUserEmail, useUpdateBalance, useUpdatePackage };
