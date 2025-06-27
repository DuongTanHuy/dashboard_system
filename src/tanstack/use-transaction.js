import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const {
  getTransactionHistoryApi,
  deleteTransactionHistoryApi,
  getBankingTransactionHistoryApi,
} = require('src/api/transaction-history.api');
const { default: QueryKeys } = require('src/utils/query-keys');

const useGetTransactionList = (params, queryOptions) =>
  useQuery({
    ...queryOptions,
    queryKey: [QueryKeys.TRANSACTION_LIST, params],
    queryFn: async () => {
      const response = await getTransactionHistoryApi(params);
      return response.data;
    },
  });

const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transactionId) => {
      await deleteTransactionHistoryApi(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTION_LIST] });
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
    },
  });
};

const useGetBankingTransaction = (params, queryOptions) =>
  useQuery({
    ...queryOptions,
    queryKey: [QueryKeys.BANKING_TRANSACTION_LIST, params],
    queryFn: async () => {
      const response = await getBankingTransactionHistoryApi(params);

      return response.data;
    },
  });

export { useGetTransactionList, useDeleteTransaction, useGetBankingTransaction };
