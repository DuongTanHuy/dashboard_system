import { Helmet } from 'react-helmet-async';
// sections
import AccountSettingView from 'src/sections/account-setting/view';

// ----------------------------------------------------------------------

export default function AccountSettingPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Account Setting</title>
      </Helmet>

      <AccountSettingView />
    </>
  );
}
