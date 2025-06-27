import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Range = ({ template }) => (
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
    <CustomLabel nameLabel="Range Data">
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          name="rangeMin"
          label="Range Min"
          placeholder="Enter value"
          value={template?.config?.rangeMin}
        />
        <TextField
          fullWidth
          size="small"
          type="number"
          name="rangeMax"
          label="Range Max"
          placeholder="Enter value"
          value={template?.config?.rangeMax}
        />
      </Stack>
    </CustomLabel>
    <CustomLabel nameLabel="Default Data">
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          name="defaultMin"
          label="Default Min"
          placeholder="Enter value"
          value={template?.config?.defaultMin}
        />
        <TextField
          fullWidth
          size="small"
          type="number"
          name="defaultMax"
          label="Default Max"
          placeholder="Enter value"
          value={template?.config?.defaultMax}
        />
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
        label="Show marks"
        control={<Switch name="marks" checked={template?.config?.marks} />}
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

Range.propTypes = {
  template: PropTypes.object,
};

export default Range;
