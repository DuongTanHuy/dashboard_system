import { Helmet } from 'react-helmet-async';
// sections
import AffiliateManagementView from 'src/sections/affiliate-management/view';

// ----------------------------------------------------------------------

export default function AffiliateManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Affiliate User</title>
      </Helmet>

      <AffiliateManagementView />
    </>
  );
}
