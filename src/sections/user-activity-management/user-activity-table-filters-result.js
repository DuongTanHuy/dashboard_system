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
import { ACT_TYPE } from './user-activity-table-toolbar';

// ----------------------------------------------------------------------

export default function UserActivityTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const shortLabel = shortDateLabel(
    filters.start_date,
    filters.end_date,
    "d 'tháng' M yyyy",
    "d 'tháng' M"
  );

  const handleRemove = (name) => {
    onFilters(name, '');
  };

  const handleRemoveDate = () => {
    onFilters('start_date', null);
    onFilters('end_date', null);
    // searchParams.delete('start_date');
    // searchParams.delete('end_date');
    // router.push(`${paths.dashboard.transaction_history.recharge}?${searchParams}`);
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
        {filters.workspace_id && (
          <Block label="ID workspace:">
            <Chip
              size="small"
              label={filters.workspace_id}
              onDelete={() => handleRemove('workspace_id')}
            />
          </Block>
        )}
        {filters.username && (
          <Block label="Email hoặc tên tài khoản:">
            <Chip size="small" label={filters.username} onDelete={() => handleRemove('username')} />
          </Block>
        )}

        {filters.profile_id && (
          <Block label="ID hồ sơ:">
            <Chip
              size="small"
              label={filters.profile_id}
              onDelete={() => handleRemove('profile_id')}
            />
          </Block>
        )}

        {filters.profile_name && (
          <Block label="Tên hồ sơ:">
            <Chip
              size="small"
              label={filters.profile_name}
              onDelete={() => handleRemove('profile_name')}
            />
          </Block>
        )}

        {filters.activity_type && (
          <Block label="Hành động:">
            <Chip
              size="small"
              label={ACT_TYPE.find((item) => item.value === filters.activity_type).label}
              onDelete={() => handleRemove('activity_type')}
            />
          </Block>
        )}

        {(filters.start_date || filters.end_date) && (
          <Block label="Ngày:">
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

UserActivityTableFiltersResult.propTypes = {
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
