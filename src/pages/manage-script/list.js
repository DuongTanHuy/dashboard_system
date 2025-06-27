import { Helmet } from 'react-helmet-async';
// sections
import { ListScriptView } from 'src/sections/approve-script/view';

// ----------------------------------------------------------------------

export default function ListScriptPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: List script</title>
      </Helmet>

      <ListScriptView />
    </>
  );
}
