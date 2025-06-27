import PropTypes from 'prop-types';

import { useMemo } from 'react';
import { Card, IconButton, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import Group from './forms/Group';
import Grid from './forms/Grid';
import Divider from './forms/Divider';
import Inline from './forms/Inline';
import Alert from './forms/Alert';
import Input from './forms/Input';
import InputNumber from './forms/InputNumber';
import Textarea from './forms/Textarea';
import Select from './forms/Select';
import SwitchMode from './forms/Switch';
import Checkbox from './forms/Checkbox';
import RadioTemplate from './forms/Radio';
import Slider from './forms/Slider';
import Link from './forms/Link';
import Range from './forms/Range';
import Text from './forms/Text';
import File from './forms/File';
import Image from './forms/Image';
import Html from './forms/html';
import { findItemById } from './utils';

const componentMap = {
  Group,
  Grid,
  Divider,
  Inline,
  Alert,
  Input,
  'Input Number': InputNumber,
  Textarea,
  SelectDropdown: Select,
  Switch: SwitchMode,
  Checkbox,
  Radio: RadioTemplate,
  Select,
  Slider,
  Range,
  Link,
  Text,
  File,
  Image,
  Html,
};

const Sidebar = ({ selectingItem, ruleset, setSelectingItem }) => {
  const SelectedComponent = componentMap[selectingItem.name];

  const currentTemplate = useMemo(
    () => findItemById(ruleset, selectingItem.id),
    [ruleset, selectingItem]
  );

  return (
    <Card
      sx={{
        py: 1,
        borderRadius: 1,
        height: '100%',
      }}
    >
      <Scrollbar
        sx={{
          height: '100%',
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography sx={{ fontSize: '18px' }}>Component Attribute</Typography>
          <IconButton onClick={() => setSelectingItem(null)}>
            <Iconify icon="mingcute:close-fill" />
          </IconButton>
        </Stack>
        {SelectedComponent && <SelectedComponent template={currentTemplate} />}
      </Scrollbar>
    </Card>
  );
};

Sidebar.propTypes = {
  selectingItem: PropTypes.object,
  ruleset: PropTypes.object,
  setSelectingItem: PropTypes.func,
};

export default Sidebar;
