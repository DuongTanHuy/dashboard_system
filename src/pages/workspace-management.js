import { Helmet } from 'react-helmet-async';
// sections
import WorkspaceManagementView from 'src/sections/workspace-management/view';

// ----------------------------------------------------------------------

export default function WorkspaceManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Workspace management</title>
      </Helmet>

      <WorkspaceManagementView />
    </>
  );
}
