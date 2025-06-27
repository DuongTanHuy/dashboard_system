import { Helmet } from 'react-helmet-async';
import { useGetPublishWorkflowDetail } from 'src/api/workflow.api';
import { useParams } from 'src/routes/hooks';
// sections
import { DetailScriptView } from 'src/sections/approve-script/view';

// ----------------------------------------------------------------------

export default function ScriptApproveDetailPage() {
  const params = useParams();

  const detailId = params?.scriptId;

  const { workflow, workflowLoading } = useGetPublishWorkflowDetail(detailId);

  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Script detail</title>
      </Helmet>

      <DetailScriptView workflowInfo={workflow} workflowLoading={workflowLoading} />
    </>
  );
}
