import { Helmet } from 'react-helmet-async';
// sections

import PermissionManagementView from 'src/sections/permission-management/view';

// ----------------------------------------------------------------------

export default function PermissionManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Permission Management</title>
      </Helmet>

      <PermissionManagementView />
    </>
  );
}
