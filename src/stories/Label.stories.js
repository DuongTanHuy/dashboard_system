import React from 'react';
import { Stack, Typography } from '@mui/material';
import Label from 'src/components/label';

export default {
  title: 'Components/Label',
  // component: Label,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'default'],
      },
    },
    startIcon: {
      control: 'text',
    },
    endIcon: {
      control: 'text',
    },
  },
};

// eslint-disable-next-line react/destructuring-assignment
const Template = (args) => <Label {...args}>{args.children || 'Label'}</Label>;

// 1. Filled Buttons
export const Filled = (args) => (
  <Stack
    spacing={2}
    direction="row"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Template {...args} color="default">
      Default
    </Template>
    <Template {...args} color="primary">
      Primary
    </Template>
    <Template {...args} color="secondary">
      Secondary
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="error">
      Error
    </Template>
  </Stack>
);
Filled.args = {
  variant: 'filled',
};

// 2. Outlined Buttons
export const Outlined = (args) => (
  <Stack
    spacing={2}
    direction="row"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Template {...args} color="primary">
      Primary
    </Template>
    <Template {...args} color="secondary">
      Secondary
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="error">
      Error
    </Template>
  </Stack>
);
Outlined.args = {
  variant: 'outlined',
};

// 3. Ghost Buttons
export const Ghost = (args) => (
  <Stack
    spacing={2}
    direction="row"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Template {...args} color="default">
      Default
    </Template>
    <Template {...args} color="primary">
      Primary
    </Template>
    <Template {...args} color="secondary">
      Secondary
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="error">
      Error
    </Template>
  </Stack>
);
Ghost.args = {
  variant: 'ghost',
};

// 3. Soft Buttons
export const Soft = (args) => (
  <Stack
    spacing={2}
    direction="row"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Template {...args} color="default">
      Default
    </Template>
    <Template {...args} color="primary">
      Primary
    </Template>
    <Template {...args} color="secondary">
      Secondary
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="error">
      Error
    </Template>
  </Stack>
);
Soft.args = {
  variant: 'soft',
};

// 5. Combined Labels
export const AllVariants = (args) => (
  <Stack
    spacing={4}
    direction="column"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Typography variant="h3">Filled Labels</Typography>
    <Filled {...args} {...Filled.args} />
    <Typography variant="h3">Outlined Labels</Typography>
    <Outlined {...args} {...Outlined.args} />
    <Typography variant="h3">Ghost Labels</Typography>
    <Ghost {...args} {...Ghost.args} />
    <Typography variant="h3">Soft Labels</Typography>
    <Soft {...args} {...Soft.args} />
  </Stack>
);
AllVariants.parameters = {
  docs: {
    description: {
      story: 'Tổng hợp tất cả các loại Label variants và màu sắc.',
    },
  },
};
