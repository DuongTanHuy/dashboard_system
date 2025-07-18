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
import { shortDateLabel } from 'src/components/custom-date-range-picker';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function CommissionFeeTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const shortLabel = shortDateLabel(
    filters.start_date,
    filters.end_date,
    "d 'tháng' M yyyy",
    "d 'tháng' M"
  );

  const handleRemoveCode = () => {
    onFilters('code', '');
  };

  const handleRemoveReferer = () => {
    onFilters('referer_username', '');
  };

  const handleRemoveDate = () => {
    onFilters('start_date', null);
    onFilters('end_date', null);
    searchParams.delete('start_date');
    searchParams.delete('end_date');
    router.push(`${paths.dashboard.affiliate.commission_fee}?${searchParams}`);
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
        {filters.referer_username && (
          <Block label="Người nhận hoa hồng:">
            <Chip size="small" label={filters.referer_username} onDelete={handleRemoveReferer} />
          </Block>
        )}

        {filters.code && (
          <Block label="Mã đối soát:">
            <Chip size="small" label={filters.code} onDelete={handleRemoveCode} />
          </Block>
        )}

        {(filters.start_date || filters.end_date) && (
          <Block label="Ngày tạo:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
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

CommissionFeeTableFiltersResult.propTypes = {
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
