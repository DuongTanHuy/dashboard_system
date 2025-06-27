import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Text = ({ template }) => (
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
      <TextField
        size="small"
        name="defaultValue"
        placeholder="Enter value"
        value={template?.config?.defaultValue}
      />
    </CustomLabel>

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Custom Color"
        control={<Switch name="customColor" checked={template?.config?.customColor} />}
      />
    </CustomLabel>

    {template?.config?.customColor && (
      <CustomLabel nameLabel="Color">
        <TextField
          size="small"
          name="color"
          placeholder="Enter value"
          value={template?.config?.color}
        />
      </CustomLabel>
    )}

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Strong"
        control={<Switch name="strong" checked={template?.config?.strong} />}
      />
    </CustomLabel>

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Italic"
        control={<Switch name="italic" checked={template?.config?.italic} />}
      />
    </CustomLabel>

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Underline"
        control={<Switch name="underline" checked={template?.config?.underline} />}
      />
    </CustomLabel>

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Delete"
        control={<Switch name="delete" checked={template?.config?.delete} />}
      />
    </CustomLabel>

    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Hide Label"
        control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
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

    <CustomLabel nameLabel="Depth">
      <TextField fullWidth size="small" value={template?.config?.depth ?? ''} />
    </CustomLabel>
  </Stack>
);

Text.propTypes = {
  template: PropTypes.object,
};

export default Text;
