import { Helmet } from 'react-helmet-async';
// sections
import { VerifyOtpView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function OTPPage() {
  return (
    <>
      <Helmet>
        <title> MKTLogin CMS: OTP Verify</title>
      </Helmet>

      <VerifyOtpView />
    </>
  );
}
