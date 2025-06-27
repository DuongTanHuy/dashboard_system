import { Helmet } from 'react-helmet-async';
// sections
import ReconciliationView from 'src/sections/affiliate-reconciliation/view';

// ----------------------------------------------------------------------

export default function AffiliateReconciliationPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Affiliate Reconciliation</title>
      </Helmet>

      <ReconciliationView />
    </>
  );
}
