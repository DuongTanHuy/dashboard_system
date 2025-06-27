import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Label from './label';

export default function CustomLabel({ length, numItem, setNumItem }) {
  return (
    <Label
      component={Button}
      onClick={() => (numItem === length ? setNumItem(8) : setNumItem(length))}
      sx={{
        p: 2,
        color: 'text.primary',
        cursor: 'pointer',
        position: 'relative',
        background: (theme) => theme.palette.background.natural,
        '&::after': {
          content: '""',
          borderRadius: '6px',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1))`,
        },
      }}
    >
      {`${numItem === length ? 'Ẩn' : `+ ${length - numItem} hồ sơ`}`}
    </Label>
  );
}

CustomLabel.propTypes = {
  length: PropTypes.number,
  numItem: PropTypes.number,
  setNumItem: PropTypes.func,
};
