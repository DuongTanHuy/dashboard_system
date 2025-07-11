import { LoginView } from 'src/sections/auth/jwt';
import { Typography } from '@mui/material';
import AuthClassicLayout from 'src/layouts/auth/classic';

export default {
  title: 'Page/Login',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const Login = (args) => (
  <AuthClassicLayout
    sx={{
      width: { xs: 420, lg: 500 },
      p: 4,
      pt: 2.5,
      overflow: 'unset',
    }}
    title={
      <Typography variant="h4" color="primary" mb={6}>
        SignIn to MKTLogin CMS
      </Typography>
    }
  >
    <LoginView {...args} />
  </AuthClassicLayout>
);
