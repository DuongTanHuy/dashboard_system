import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Group = ({ template }) => (
  <Stack>
    <CustomLabel nameLabel="group">
      <Chip size="small" label="group" color="primary" sx={{ width: '80px' }} />
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
        label="Hide Label"
        control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show border"
        control={<Switch name="showBorder" checked={template?.config?.showBorder} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Label Width">
      <TextField
        type="number"
        size="small"
        placeholder="Enter value"
        value={template?.config?.labelWidth}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Width">
      <TextField
        type="number"
        size="small"
        placeholder="Enter value"
        value={template?.config?.width || ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Height">
      <TextField
        type="number"
        size="small"
        placeholder="Enter value"
        value={template?.config?.height || ''}
      />
    </CustomLabel>
  </Stack>
);

Group.propTypes = {
  template: PropTypes.object,
};

export default Group;
