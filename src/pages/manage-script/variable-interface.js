import { Helmet } from 'react-helmet-async';
import { useGetWorkflowDetail } from 'src/api/workflow.api';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'src/routes/hooks';
// sections
import { VariableInterfaceView } from 'src/sections/approve-script/view';

// ----------------------------------------------------------------------

export default function PublishVariableInterfacePage() {
  const params = useParams();

  const detailId = params?.scriptId;

  const { workflow, workflowLoading } = useGetWorkflowDetail(detailId);

  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Variable interface</title>
      </Helmet>

      {workflowLoading ? <LoadingScreen /> : <VariableInterfaceView workflowInfo={workflow} />}
    </>
  );
}
