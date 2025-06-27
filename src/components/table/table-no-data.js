import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
//
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, sx, colSpan = 12 }) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={colSpan}>
          <EmptyContent
            filled
            title="Không tìm thấy dữ liệu"
            sx={{
              py: 10,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={colSpan} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  sx: PropTypes.object,
  colSpan: PropTypes.number,
};
