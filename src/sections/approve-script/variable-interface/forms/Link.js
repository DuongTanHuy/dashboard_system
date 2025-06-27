import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const { Stack, Chip, TextField, FormControlLabel, Switch } = require('@mui/material');

const Link = ({ template }) => (
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

    <CustomLabel nameLabel="Href Data">
      <TextField
        size="small"
        name="defaultValue"
        placeholder="Enter value"
        value={template?.config?.defaultValue}
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>
    <CustomLabel nameLabel="">
      <FormControlLabel
        label="Open in new tab"
        control={<Switch name="openNewTab" checked={template?.config?.openNewTab} />}
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
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>

    <CustomLabel nameLabel="Display text">
      <TextField
        size="small"
        name="displayText"
        placeholder="Enter value"
        value={template?.config?.displayText}
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>

    <CustomLabel nameLabel="Label Width">
      <TextField
        type="number"
        size="small"
        name="labelWidth"
        placeholder="Enter value"
        value={template?.config?.labelWidth}
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Width">
      <TextField
        type="number"
        size="small"
        name="width"
        placeholder="Enter value"
        value={template?.config?.width ?? ''}
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>
    <CustomLabel nameLabel="Height">
      <TextField
        type="number"
        size="small"
        name="height"
        placeholder="Enter value"
        value={template?.config?.height ?? ''}
        inputProps={{
          autoCorrect: 'off',
          spellCheck: 'false',
          autoCapitalize: 'none',
          'aria-autocomplete': 'none',
          'aria-expanded': false,
        }}
      />
    </CustomLabel>
  </Stack>
);

Link.propTypes = {
  template: PropTypes.object,
};

export default Link;
