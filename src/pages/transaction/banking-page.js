import { Helmet } from 'react-helmet-async';
// sections
import BankingView from 'src/sections/banking/view';

// ----------------------------------------------------------------------

export default function BankingPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Banking</title>
      </Helmet>

      <BankingView />
    </>
  );
}
