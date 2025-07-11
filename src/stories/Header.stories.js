// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from 'storybook/test';
import Header from 'src/layouts/dashboard/header';
import { Box } from '@mui/material';

export default {
  title: 'Layout/Header',
  // component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onOpenNav: fn(),
  },
};

export const Heading = (args) => (
  <Box sx={{ width: '100%', height: '100%', minHeight: '100px' }}>
    <Header {...args} />
  </Box>
);
