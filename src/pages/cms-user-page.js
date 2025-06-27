import { Helmet } from 'react-helmet-async';
// sections
import CmsUserView from 'src/sections/cms-user/view';
// ----------------------------------------------------------------------

export default function CmsUserPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: CMS User</title>
      </Helmet>

      <CmsUserView />
    </>
  );
}
