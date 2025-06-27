import { Helmet } from 'react-helmet-async';
// sections
import UserActivityManagementView from 'src/sections/user-activity-management/view';

// ----------------------------------------------------------------------

export default function UserActivityManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: User Activity Management</title>
      </Helmet>

      <UserActivityManagementView />
    </>
  );
}
