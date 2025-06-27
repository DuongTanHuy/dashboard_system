import { Helmet } from 'react-helmet-async';
// sections
import RevenueStatisticalView from 'src/sections/statistical/views/revenue-view';

// ----------------------------------------------------------------------

export default function RevenueStatisticalPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Revenue</title>
      </Helmet>

      <RevenueStatisticalView />
    </>
  );
}
