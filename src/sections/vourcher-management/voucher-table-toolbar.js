import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';

// ----------------------------------------------------------------------

export const IS_EXPIRED_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'true', label: 'Đã hết hạn' },
  { id: 'false', label: 'Chưa hết hạn' },
];

export const VOUCHER_TYPE_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'percentage', label: 'Phần trăm' },
  { id: 'amount', label: 'Giá trị cố định' },
];

export default function VoucherTableToolbar({ filters, onFilters, onCreate }) {
  const theme = useTheme();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCode = useCallback(
    (event) => {
      onFilters('code', event.target.value);
    },
    [onFilters]
  );

  const handleFilterVoucherType = useCallback(
    (event) => {
      onFilters('voucher_type', event.target.value);
    },
    [onFilters]
  );

  const handleFilterIsExpired = useCallback(
    (event) => {
      onFilters('is_expired', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      sx={{
        p: 2.5,
        pt: { xs: 12, sm: 2 },
        transition: theme.transitions.create('all', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
        mb: 13,
      }}
      position="relative"
    >
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="space-between"
        spacing={1}
        sx={{
          position: 'absolute',
          top: -10,
          left: 24,
          right: 24,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="end">
          <Stack
            component={Button}
            sx={{
              ...bgGradient({
                direction: 'to top',
                startColor: alpha(theme.palette.primary.light, 0.6),
                endColor: alpha(theme.palette.primary.main, 0.6),
              }),
              borderRadius: 1,
              p: 2.5,
              boxShadow: theme.customShadows.z4,
              '&:hover': {
                boxShadow: 'none',
                transform: 'scale(0.94)',
              },
              transition: theme.transitions.create(['all'], {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          >
            <Iconify icon="mdi:voucher-outline" width={30} color="white" />
          </Stack>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            whiteSpace="nowrap"
            sx={{
              pb: 1,
            }}
          >
            Quản Lý Mã Giảm Giá
          </Typography>
        </Stack>

        <Button
          variant="contained"
          // color="primary"
          startIcon={<Iconify icon="mingcute:add-fill" />}
          onClick={onCreate}
        >
          Thêm voucher
        </Button>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 3 }}
        alignItems="end"
        justifyContent="space-between"
        sx={{
          position: 'absolute',
          top: 74,
          left: 24,
          right: 24,
        }}
      >
        <TextField
          color="primary"
          variant="standard"
          value={filters.name}
          onChange={handleFilterName}
          // defaultValue={filters.name}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Tên voucher"
          sx={{
            mt: { xs: 2, sm: 0 },
            width: { xs: '100%', lg: 1 },
            '& input': {
              padding: 0,
              height: 40,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          color="primary"
          variant="standard"
          value={filters.code}
          onChange={handleFilterCode}
          // defaultValue={filters.name}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Mã voucher"
          sx={{
            mt: { xs: 2, sm: 0 },
            width: { xs: '100%', lg: 1 },
            '& input': {
              padding: 0,
              height: 40,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          name="voucher_type"
          variant="standard"
          label="Loại voucher"
          value={filters.voucher_type}
          sx={{
            mt: { xs: 2, sm: 0 },
            width: { xs: '100%', lg: 1 },
            '& input': {
              padding: 0,
              height: 40,
            },
          }}
          onChange={handleFilterVoucherType}
        >
          {VOUCHER_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="is_expired"
          variant="standard"
          label="Trạng thái"
          value={filters.is_expired}
          sx={{
            mt: { xs: 2, sm: 0 },
            width: { xs: '100%', lg: 1 },
            '& input': {
              padding: 0,
              height: 40,
            },
          }}
          onChange={handleFilterIsExpired}
        >
          {IS_EXPIRED_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

VoucherTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  onCreate: PropTypes.func,
  filters: PropTypes.object,
};
