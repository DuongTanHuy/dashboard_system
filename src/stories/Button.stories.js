import React from 'react';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';

export default {
  title: 'Components/Button',
  // sử dụng export const Contained = (args) => (...) thì không cần khai báo component ở đây
  // component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      },
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
};

// eslint-disable-next-line react/destructuring-assignment
const Template = (args) => <Button {...args}>{args.children || 'Button'}</Button>;

// 1. Contained Buttons
export const Contained = (args) => (
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
    <Template {...args} color="error">
      Error
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} disabled>
      Disabled
    </Template>
  </Stack>
);
Contained.args = {
  variant: 'contained',
};
Contained.parameters = {
  docs: {
    description: {
      story: 'Nút **contained** có nền màu và thường được dùng cho các hành động chính, nổi bật.',
    },
  },
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
    <Template {...args} color="error">
      Error
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} disabled>
      Disabled
    </Template>
  </Stack>
);
Outlined.args = {
  variant: 'outlined',
};
Outlined.parameters = {
  docs: {
    description: {
      story: 'Nút **outlined** có viền và không có nền màu, thích hợp cho các hành động phụ.',
    },
  },
};

// 3. Text Buttons
export const Text = (args) => (
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
    <Template {...args} color="error">
      Error
    </Template>
    <Template {...args} color="warning">
      Warning
    </Template>
    <Template {...args} color="info">
      Info
    </Template>
    <Template {...args} color="success">
      Success
    </Template>
    <Template {...args} disabled>
      Disabled
    </Template>
  </Stack>
);
Text.args = {
  variant: 'text',
};
Text.parameters = {
  docs: {
    description: {
      story: 'Nút **text** không có nền hoặc viền, dùng cho các hành động ít quan trọng hơn.',
    },
  },
};

// 4. Combined Buttons
export const AllVariants = (args) => (
  <Stack
    spacing={4}
    direction="column"
    width={1}
    height={1}
    justifyContent="center"
    alignItems="center"
  >
    <Typography variant="h3">Contained Buttons</Typography>
    <Contained {...args} {...Contained.args} />
    <Typography variant="h3">Outlined Buttons</Typography>
    <Outlined {...args} {...Outlined.args} />
    <Typography variant="h3">Text Buttons</Typography>
    <Text {...args} {...Text.args} />
  </Stack>
);
AllVariants.parameters = {
  docs: {
    description: {
      story: 'Tổng hợp tất cả các loại Button variants và màu sắc.',
    },
  },
};
