import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Slider = ({ template }) => (
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
      <TextField
        size="small"
        type="number"
        name="defaultValue"
        placeholder="Enter value"
        value={template?.config?.defaultValue}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Marks">
      <Stack spacing={2}>
        {template?.config?.marks.map((option) => (
          <Stack key={option.id} direction="row" spacing={1} alignItems="center">
            <TextField size="small" placeholder="Enter label" defaultValue={option.label} />

            <TextField
              type="number"
              size="small"
              placeholder="Enter value"
              defaultValue={option.value}
            />
          </Stack>
        ))}
      </Stack>
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Hide Label"
        control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show Marks"
        control={<Switch name="showMarks" checked={template?.config?.showMarks} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Tooltip"
        control={<Switch name="tooltip" checked={template?.config?.tooltip} />}
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
    <CustomLabel nameLabel="Max Value">
      <TextField
        type="number"
        size="small"
        name="maxLength"
        placeholder="Enter value"
        value={template?.config?.maxLength ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Min Value">
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

Slider.propTypes = {
  template: PropTypes.object,
};

export default Slider;
