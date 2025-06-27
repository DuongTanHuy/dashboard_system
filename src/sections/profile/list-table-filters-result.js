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
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function ListProfileTableFiltersResult({
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

  const handleRemoveProfileId = () => {
    onFilters('profile_id', '');
  };

  const handleRemoveProfileGroupId = () => {
    onFilters('profile_group_id', '');
  };
  const handleRemoveWs = () => {
    onFilters('ws_id', '');
  };

  const handleRemoveSearch = () => {
    onFilters('name', '');
  };

  const handleRemoveProfile = () => {
    onFilters('profile', '');
  };

  const handleRemoveUserOwner = () => {
    onFilters('user_owner', '');
  };

  const handleRemoveDate = () => {
    onFilters('start_date', null);
    onFilters('end_date', null);
    searchParams.delete('start_date');
    searchParams.delete('end_date');
    router.push(`${paths.dashboard.profile.list}?${searchParams}`);
  };

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveDeleteStatus = () => {
    onFilters('delete_status', 'undeleted');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          Kết quả tìm kiếm
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.profile_id && (
          <Block label="ID hồ sơ:">
            <Chip size="small" label={filters.profile_id} onDelete={handleRemoveProfileId} />
          </Block>
        )}
        {filters.ws_id && (
          <Block label="ID workspace:">
            <Chip size="small" label={filters.ws_id} onDelete={handleRemoveWs} />
          </Block>
        )}
        {filters.profile && (
          <Block label="Tên hồ sơ:">
            <Chip size="small" label={filters.profile} onDelete={handleRemoveProfile} />
          </Block>
        )}
        {filters.profile_group_id && (
          <Block label="ID nhóm hồ sơ:">
            <Chip
              size="small"
              label={filters.profile_group_id}
              onDelete={handleRemoveProfileGroupId}
            />
          </Block>
        )}
        {filters.name && (
          <Block label="Người tạo:">
            <Chip size="small" label={filters.name} onDelete={handleRemoveSearch} />
          </Block>
        )}
        {filters.user_owner && (
          <Block label="Người sở hữu:">
            <Chip size="small" label={filters.user_owner} onDelete={handleRemoveUserOwner} />
          </Block>
        )}
        {filters.status !== 'all' && (
          <Block label="Thời hạn:">
            <Chip
              size="small"
              label={filters.status === 'alive' ? 'Còn hạn' : 'Hết hạn'}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}
        {filters.delete_status !== 'undeleted' && (
          <Block label="Trạng thái xóa:">
            <Chip
              size="small"
              label={filters.delete_status === 'all' ? 'Tất cả' : 'Đã xóa'}
              onDelete={handleRemoveDeleteStatus}
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
          onClick={() => {
            searchParams.delete('transaction_type');
            searchParams.delete('page');
            router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
            onResetFilters();
          }}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Loại bỏ
        </Button>
      </Stack>
    </Stack>
  );
}

ListProfileTableFiltersResult.propTypes = {
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
