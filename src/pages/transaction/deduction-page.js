import { Helmet } from 'react-helmet-async';
// sections
import DeductionView from 'src/sections/deduction/view';

// ----------------------------------------------------------------------

export default function DeductionPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Deduction</title>
      </Helmet>

      <DeductionView />
    </>
  );
}
