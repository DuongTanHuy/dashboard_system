import { Helmet } from 'react-helmet-async';
// sections
import { ApproveScriptView } from 'src/sections/approve-script/view';

// ----------------------------------------------------------------------

export default function ApproveScriptPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Approve script</title>
      </Helmet>

      <ApproveScriptView />
    </>
  );
}
