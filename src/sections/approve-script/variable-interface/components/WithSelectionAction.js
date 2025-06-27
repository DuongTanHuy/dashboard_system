import { Stack } from '@mui/material';

const PropTypes = require('prop-types');

const WithSectionAction = ({ children, isActive }) => (
  <Stack
    id="wrapper-content"
    sx={{
      position: 'relative',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid lightgray',
      borderRadius: '4px',
      cursor: 'pointer',
      borderColor: isActive ? '#0d936e' : 'text.secondary',
    }}
  >
    {children}
  </Stack>
);

WithSectionAction.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
};

export default WithSectionAction;
