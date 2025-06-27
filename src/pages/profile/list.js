import { Helmet } from 'react-helmet-async';
// sections
import { ListProfileView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function ListProfilePage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: List profile</title>
      </Helmet>

      <ListProfileView />
    </>
  );
}
