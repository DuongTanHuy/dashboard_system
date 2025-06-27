import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { bgGradient } from 'src/theme/css';

// components
import { Button, InputAdornment, MenuItem, Typography, alpha, useTheme } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';

const PAYMENT_STATUS = [
  { label: 'Đã thanh toán', value: 'paid' },
  { label: 'Chờ thanh toán', value: 'pending' },
];

// ----------------------------------------------------------------------

export default function ReconciliationTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const open = useBoolean();

  const handleFilterReconciliation = useCallback(
    (event) => {
      onFilters(event.target.name, event.target.value);
    },
    [onFilters]
  );

  const handleFilterDate = useCallback(
    (newValue) => {
      onFilters('month_year', newValue);
    },
    [onFilters]
  );

  const handleFilterPayment = useCallback(
    (event) => {
      onFilters('payment_status', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      sx={{
        p: 2.5,
        pt: { xs: 8, lg: 2 },
        transition: theme.transitions.create('all', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
      }}
      position="relative"
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: 'absolute',
          top: -10,
        }}
      >
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
          <Iconify icon="ant-design:reconciliation-filled" width={30} color="white" />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            bottom: -14,
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" whiteSpace="nowrap">
            Quản Lý Đối soát
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems="end"
        justifyContent="flex-end"
        width={{ sm: '100%', lg: 'calc(100% - 400px)' }}
        ml={{ sm: 0, lg: 'auto' }}
      >
        <TextField
          color="primary"
          name="username"
          variant="standard"
          value={filters.username}
          onChange={handleFilterReconciliation}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Người nhận"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 260 },
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
          name="code"
          variant="standard"
          value={filters.code}
          onChange={handleFilterReconciliation}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Mã đối soát"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 260 },
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
          label="Trạng thái"
          color="primary"
          variant="standard"
          value={filters.payment_status}
          onChange={handleFilterPayment}
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 260 },
            '& input': {
              padding: 0,
              height: 40,
            },
          }}
        >
          {PAYMENT_STATUS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          open={open.value}
          onClose={open.onFalse}
          views={['month', 'year']}
          label="Tháng"
          value={filters.month_year}
          onChange={handleFilterDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'standard',
              placeholder: 'Ngày/Tháng/Năm',
              onClick: open.onTrue,
            },
          }}
          sx={{
            width: { xs: 1, lg: 'fit-content' },
          }}
        />
      </Stack>
    </Stack>
  );
}

ReconciliationTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
