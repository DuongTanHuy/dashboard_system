import { Helmet } from 'react-helmet-async';
// sections
import VoucherManagementView from 'src/sections/vourcher-management/view';

// ----------------------------------------------------------------------

export default function VoucherManagementPage() {
  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Voucher Management</title>
      </Helmet>

      <VoucherManagementView />
    </>
  );
}
