import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCmsUserApi,
  deleteCmsUserApi,
  getListCmsUserApi,
  updateCmsUserApi,
} from 'src/api/cms-user.api';
import QueryKeys from 'src/utils/query-keys';

const useCmsUser = (queryOptions) =>
  useQuery({
    queryKey: [QueryKeys.CMS_USER_LIST],
    queryFn: async () => {
      const response = await getListCmsUserApi();
      return response.data.data;
    },

    refetchOnWindowFocus: true,
    initialData: [],
    ...queryOptions,
  });

const useCreateCmsUse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await createCmsUserApi(payload);
      return response.data.data.password;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.USER_LIST]);
    },
    onError: (error) => {
      console.error('Error creating CMS user:', error);
    },
  });
};

const useUpdateCmsUse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }) => {
      await updateCmsUserApi(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.CMS_USER_LIST]);
    },
    onError: (error) => {
      console.error('Error creating CMS user:', error);
    },
  });
};

const useDeleteCmsUse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      await deleteCmsUserApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.CMS_USER_LIST]);
    },
    onError: (error) => {
      console.error('Error creating CMS user:', error);
    },
  });
};

export { useCmsUser, useCreateCmsUse, useDeleteCmsUse, useUpdateCmsUse };
