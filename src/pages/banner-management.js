import { Helmet } from 'react-helmet-async';
// sections
import BannerManagementView from 'src/sections/banner-management/view';

// ----------------------------------------------------------------------

export default function BannerManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Banner Management</title>
      </Helmet>

      <BannerManagementView />
    </>
  );
}
