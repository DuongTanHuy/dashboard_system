import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const InputNumber = ({ template }) => (
  <Stack>
    <CustomLabel nameLabel="InputTemplate">
      <Chip size="small" label="Input" color="primary" sx={{ width: '80px' }} />
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
        type="number"
        name="defaultValue"
        placeholder="Enter value"
        value={template?.config?.defaultValue ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show Bordered"
        control={<Switch name="showBordered" checked={template?.config?.showBordered} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Hide Label"
        control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Clearable"
        control={<Switch name="clearable" checked={template?.config?.clearable} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Readonly"
        control={<Switch name="readOnly" checked={template?.config?.readOnly} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show Button"
        control={<Switch name="showButton" checked={template?.config?.showButton} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Is required"
        control={<Switch name="isRequired" checked={template?.config?.isRequired} />}
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
    <CustomLabel nameLabel="Placeholder">
      <TextField
        size="small"
        name="placeholder"
        placeholder="Enter value"
        value={template?.config?.placeholder}
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
    <CustomLabel nameLabel="Max Length">
      <TextField
        type="number"
        size="small"
        name="maxLength"
        placeholder="Enter value"
        value={template?.config?.maxLength ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Min Length">
      <TextField
        type="number"
        size="small"
        name="minLength"
        placeholder="Enter value"
        value={template?.config?.minLength ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Step">
      <TextField
        type="number"
        size="small"
        name="step"
        placeholder="Enter value"
        value={template?.config?.step ?? ''}
      />
    </CustomLabel>
  </Stack>
);

InputNumber.propTypes = {
  template: PropTypes.object,
};

export default InputNumber;
