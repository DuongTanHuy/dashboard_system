import { Helmet } from 'react-helmet-async';
// sections
import AffiliateStatisticalView from 'src/sections/statistical/views/affiliate-view';

// ----------------------------------------------------------------------

export default function AffiliateStatisticalPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Affiliate</title>
      </Helmet>

      <AffiliateStatisticalView />
    </>
  );
}
