import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const {
  Stack,
  Chip,
  TextField,
  FormControlLabel,
  Switch,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
} = require('@mui/material');

export const ACCEPT_TYPE_OPTIONS = [
  { id: 1, label: 'Text', value: '.txt' },
  { id: 2, label: 'Excel', value: '.xlsx, .xls, .csv' },
  { id: 3, label: 'Json', value: '.json' },
  { id: 4, label: 'Image', value: '.png, .jpg, .jpeg, .gif, .svg' },
  { id: 5, label: 'Folder', value: 'folder' },
];

const Input = ({ template }) => (
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
        name="defaultValue"
        placeholder="Enter value"
        value={template?.config?.defaultValue ?? ''}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Show Text Count"
        control={<Switch name="showTextCount" checked={template?.config?.showTextCount} />}
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
        label="Show upload button"
        control={<Switch name="rightButton" checked={template?.config?.rightButton} />}
      />
      {template?.config?.rightButton && (
        <FormControl>
          <FormLabel id="input-accept-type-label">Accept Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="input-accept-type-group"
            value={template?.config?.acceptType}
            name="acceptType"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              pl: 1,
            }}
          >
            {ACCEPT_TYPE_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
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
  </Stack>
);

Input.propTypes = {
  template: PropTypes.object,
};

export default Input;
