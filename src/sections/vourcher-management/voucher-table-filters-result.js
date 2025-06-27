import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// components
import Iconify from 'src/components/iconify';
import { Typography } from '@mui/material';
import { IS_EXPIRED_OPTIONS, VOUCHER_TYPE_OPTIONS } from './voucher-table-toolbar';

// ----------------------------------------------------------------------

export default function VoucherTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const handleRemoveName = () => {
    onFilters('name', '');
  };
  const handleRemoveCode = () => {
    onFilters('code', '');
  };

  const handleRemoveIsExpired = () => {
    onFilters('is_expired', 'all');
  };

  const handleRemoveVoucherType = () => {
    onFilters('voucher_type', 'all');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {' '}
          Kết quả tìm kiếm
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.name && (
          <Block label="Tên voucher:">
            <Chip size="small" label={filters.name} onDelete={handleRemoveName} />
          </Block>
        )}

        {filters.code && (
          <Block label="Mã voucher:">
            <Chip size="small" label={filters.code} onDelete={handleRemoveCode} />
          </Block>
        )}

        {filters.voucher_type !== 'all' && (
          <Block label="Loại voucher:">
            <Chip
              size="small"
              label={
                VOUCHER_TYPE_OPTIONS.find((option) => option.id === filters.voucher_type)?.label
              }
              onDelete={handleRemoveVoucherType}
            />
          </Block>
        )}

        {filters.is_expired !== 'all' && (
          <Block label="Trạng thái:">
            <Chip
              size="small"
              label={IS_EXPIRED_OPTIONS.find((option) => option.id === filters.is_expired)?.label}
              onDelete={handleRemoveIsExpired}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Loại bỏ
        </Button>
      </Stack>
    </Stack>
  );
}

VoucherTableFiltersResult.propTypes = {
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
