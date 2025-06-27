import { Helmet } from 'react-helmet-async';
// sections
import RechargeView from 'src/sections/recharge/view';

// ----------------------------------------------------------------------

export default function RechargePage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Recharge</title>
      </Helmet>

      <RechargeView />
    </>
  );
}
