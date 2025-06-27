import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const SwitchMode = ({ template }) => (
  <Stack>
    <CustomLabel nameLabel="Switch">
      <Chip size="small" label="Switch" color="primary" sx={{ width: '80px' }} />
    </CustomLabel>

    <CustomLabel nameLabel="Variables">
      <TextField
        size="small"
        placeholder="Enter value"
        defaultValue={template?.config?.variable?.key}
      />
    </CustomLabel>

    <CustomLabel nameLabel="Default Data">
      <FormControlLabel
        control={<Switch name="defaultValue" checked={template?.config?.defaultValue} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Name">
      <TextField
        size="small"
        name="name"
        placeholder="Enter value"
        value={template?.config?.name}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Loading"
        control={<Switch name="loading" checked={template?.config?.loading} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Hide Label"
        control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Label Width">
      <TextField
        type="number"
        size="small"
        name="labelWidth"
        placeholder="Enter value"
        value={template?.config?.labelWidth}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Width">
      <TextField
        type="number"
        size="small"
        name="width"
        placeholder="Enter value"
        value={template?.config?.width ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Height">
      <TextField
        type="number"
        size="small"
        name="height"
        placeholder="Enter value"
        value={template?.config?.height ?? ''}
      />
    </CustomLabel>
  </Stack>
);

SwitchMode.propTypes = {
  template: PropTypes.object,
};

export default SwitchMode;
