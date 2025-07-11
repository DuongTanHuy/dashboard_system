// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from 'storybook/test';
import { Box } from '@mui/material';
import NavVertical from 'src/layouts/dashboard/nav-vertical';
import NavHorizontal from 'src/layouts/dashboard/nav-horizontal';
import NavMini from 'src/layouts/dashboard/nav-mini';
import { useResponsive } from 'src/hooks/use-responsive';

export default {
  title: 'Layout/Sidebar',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {
    openNav: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    onCloseNav: fn(),
  },
};

export const Vertical = (args) => (
  <Box
    sx={{
      minHeight: '440px',
      height: 1,
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
    }}
  >
    <NavVertical {...args} />
  </Box>
);
Vertical.args = {
  openNav: true,
};

export const Horizontal = (args) => (
  <Box
    sx={{
      minHeight: '200px',
      height: 1,
      display: 'flex',
    }}
  >
    <NavHorizontal />
  </Box>
);

export const Mini = (args) => {
  const lgUp = useResponsive('up', 'lg');
  return (
    <Box
      sx={{
        minHeight: '440px',
        height: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
      }}
    >
      {lgUp ? <NavMini /> : <NavVertical {...args} />}
    </Box>
  );
};
