import { Helmet } from 'react-helmet-async';
// sections
import BuyPackageView from 'src/sections/buy-package/view';

// ----------------------------------------------------------------------

export default function BuyPackagePage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Buy package</title>
      </Helmet>

      <BuyPackageView />
    </>
  );
}
