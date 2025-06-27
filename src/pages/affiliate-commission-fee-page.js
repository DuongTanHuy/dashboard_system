import { Helmet } from 'react-helmet-async';
// sections
import CommissionFeeView from 'src/sections/commission-fee/view';

// ----------------------------------------------------------------------

export default function AffiliateCommissionFeePage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Affiliate Commission Fee</title>
      </Helmet>

      <CommissionFeeView />
    </>
  );
}
