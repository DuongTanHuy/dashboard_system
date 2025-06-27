import { Helmet } from 'react-helmet-async';
// sections
import UserView from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserManagePage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: User manage</title>
      </Helmet>

      <UserView />
    </>
  );
}
