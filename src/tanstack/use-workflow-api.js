const { useQuery } = require('@tanstack/react-query');
const { getListWorkflowApi } = require('src/api/workflow.api');
const { default: QueryKeys } = require('src/utils/query-keys');

const useGetListWorkflow = (params, queryOptions) =>
  useQuery({
    ...queryOptions,
    queryKey: [QueryKeys.WORKFLOW_LIST, params],
    queryFn: async ({ signal }) => {
      const response = await getListWorkflowApi(params, signal);
      return response;
    },
  });

export { useGetListWorkflow };
