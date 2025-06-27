import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const {
  getListVoucherApi,
  deleteVoucherApi,
  createVoucherApi,
  updateVoucherApi,
} = require('src/api/voucher.api');
const { default: QueryKeys } = require('src/utils/query-keys');

const useGetVoucher = (params, queryOptions) =>
  useQuery({
    ...queryOptions,
    queryKey: [QueryKeys.VOUCHER_LIST, params],
    queryFn: async () => {
      const response = await getListVoucherApi(params);
      return response.data;
    },
  });

const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (voucherId) => {
      await deleteVoucherApi(voucherId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHER_LIST] });
    },
    onError: (error) => {
      console.error('Error deleting voucher:', error);
    },
  });
};

const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      await createVoucherApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHER_LIST] });
    },
    onError: (error) => {
      console.error('Error creating voucher:', error);
      throw error;
    },
  });
};

const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ voucherId, payload }) => {
      await updateVoucherApi(voucherId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHER_LIST] });
    },
    onError: (error) => {
      console.error('Error updating voucher:', error);
      throw error;
    },
  });
};

export { useGetVoucher, useDeleteVoucher, useUpdateVoucher, useCreateVoucher };
