import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// components
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ReconciliationTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const shortLabel = fDate(filters.month_year, 'MM-yyyy');

  const handleRemoveDate = () => {
    onFilters('month_year', null);
  };

  const handleRemoveCode = () => {
    onFilters('code', '');
  };
  const handleRemoveUsername = () => {
    onFilters('username', '');
  };

  const handleRemovePaymentStatus = () => {
    onFilters('payment_status', '');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.username && (
          <Block label="Người nhận:">
            <Chip size="small" label={filters.username} onDelete={handleRemoveUsername} />
          </Block>
        )}

        {filters.code && (
          <Block label="Mã đối soát:">
            <Chip size="small" label={filters.code} onDelete={handleRemoveCode} />
          </Block>
        )}

        {filters.payment_status && (
          <Block label="Trạng thái:">
            <Chip
              size="small"
              label={filters.payment_status==='paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              onDelete={handleRemovePaymentStatus}
            />
          </Block>
        )}

        {filters.month_year && (
          <Block label="Thời gian:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

ReconciliationTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="subtitle2">{label}</Typography>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
