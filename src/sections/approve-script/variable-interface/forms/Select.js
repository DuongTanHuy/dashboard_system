import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch, Checkbox } = require('@mui/material');

const Select = ({ template }) => (
  <Stack>
    <CustomLabel nameLabel="Select">
      <Chip size="small" label="Select" color="primary" sx={{ width: '80px' }} />
    </CustomLabel>
    <CustomLabel nameLabel="Variables">
      <TextField
        size="small"
        placeholder="Enter value"
        defaultValue={template?.config?.variable?.key}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Default Data">
      <Stack spacing={2}>
        {template?.config?.options.map((option) => (
          <Stack key={option.id} direction="row" spacing={1} alignItems="center">
            <Checkbox
              checked={option.checked}
              sx={{
                p: 0.5,
                borderRadius: 1,
              }}
            />

            <TextField size="small" placeholder="Enter label" defaultValue={option.label} />

            <TextField size="small" placeholder="Enter value" defaultValue={option.value} />
          </Stack>
        ))}
      </Stack>
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
        label="Is Multiple"
        control={<Switch name="isMulti" checked={template?.config?.isMulti} />}
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
        label="Is required"
        control={<Switch name="isRequired" checked={template?.config?.isRequired} />}
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
  </Stack>
);

Select.propTypes = {
  template: PropTypes.object,
};

export default Select;
