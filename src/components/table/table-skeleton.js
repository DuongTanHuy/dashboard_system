import PropTypes from 'prop-types';

// @mui
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export default function TableSkeleton({ hasAction = true, ...other }) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={3} direction="row" alignItems="center">
          {hasAction && (
            <Skeleton sx={{ borderRadius: 1.5, width: 48, height: 48, flexShrink: 0 }} />
          )}
          <Skeleton sx={{ width: 1, height: 12 }} />
          <Skeleton sx={{ width: 1, height: 12 }} />
          <Skeleton sx={{ width: 180, height: 12 }} />
          <Skeleton sx={{ width: 160, height: 12 }} />
          <Skeleton sx={{ width: 140, height: 12 }} />
          <Skeleton sx={{ width: 120, height: 12 }} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}

TableSkeleton.propTypes = {
  hasAction: PropTypes.bool,
};
