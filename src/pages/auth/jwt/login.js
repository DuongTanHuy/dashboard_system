import { Helmet } from 'react-helmet-async';
// sections
import { LoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> MKTLogin CMS: Login</title>
      </Helmet>

      <LoginView />
    </>
  );
}
