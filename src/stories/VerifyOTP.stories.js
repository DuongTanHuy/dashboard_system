import AuthClassicLayout from 'src/layouts/auth/classic';
import { VerifyOtpView } from 'src/sections/auth/jwt';

export default {
  title: 'Page/Verify OTP',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const VerifyOtp = (args) => (
  <AuthClassicLayout
    sx={{
      width: { xs: 420, lg: 500 },
      overflow: 'unset',
    }}
  >
    <VerifyOtpView />
  </AuthClassicLayout>
);
