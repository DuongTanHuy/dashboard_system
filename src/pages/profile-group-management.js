import { Helmet } from 'react-helmet-async';
// sections
import ProfileGroupManagementView from 'src/sections/profile-group-management/view';

// ----------------------------------------------------------------------

export default function ProfileGroupManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Profile Group Management</title>
      </Helmet>

      <ProfileGroupManagementView />
    </>
  );
}
