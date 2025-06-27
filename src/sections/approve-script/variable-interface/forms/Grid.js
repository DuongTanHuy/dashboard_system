import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Grid = ({ template }) => (
  <Stack>
    <CustomLabel nameLabel="Grid">
      <Chip size="small" label="Grid" color="primary" sx={{ width: '80px' }} />
    </CustomLabel>
    <CustomLabel nameLabel="Name">
      <TextField size="small" placeholder="Enter value" value={template?.config?.name || ''} />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Hide Label"
        control={<Switch name="value" checked={template?.config?.hideLabel} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show border"
        control={<Switch name="value" checked={template?.config?.showBorder} />}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Label Width">
      <TextField
        type="number"
        size="small"
        placeholder="Enter value"
        value={template?.config?.labelWidth || ''}
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
    <CustomLabel nameLabel="Gap-x">
      <TextField
        type="number"
        size="small"
        value={template?.config?.gap || ''}
        placeholder="Enter value"
      />
    </CustomLabel>
  </Stack>
);

Grid.propTypes = {
  template: PropTypes.object,
};
export default Grid;
