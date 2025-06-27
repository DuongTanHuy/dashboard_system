import { Helmet } from 'react-helmet-async';
// sections
import DeviceManagementView from 'src/sections/device-management/view';

// ----------------------------------------------------------------------

export default function DeviceManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Device Management</title>
      </Helmet>

      <DeviceManagementView />
    </>
  );
}
