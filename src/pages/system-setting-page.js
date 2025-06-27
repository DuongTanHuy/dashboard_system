import { Helmet } from 'react-helmet-async';
import { useGetSystemConfigAPi } from 'src/api/system-config.api';
// sections
import SystemSettingView from 'src/sections/system-setting/view';

// ----------------------------------------------------------------------

export default function SystemSettingPage() {
  const { systemConfig, refetchSystemConfig } = useGetSystemConfigAPi();

  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: System setting</title>
      </Helmet>

      <SystemSettingView configData={systemConfig} reload={refetchSystemConfig} />
    </>
  );
}
