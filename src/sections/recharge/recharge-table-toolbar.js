import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import Iconify from 'src/components/iconify';
import { Button, InputAdornment, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

const OPTIONS = [
  { id: 'op_01', value: 'top_up_auto, top_up_manual', label: 'Tất cả' },
  { id: 'op_02', value: 'top_up_auto', label: 'Tự động' },
  { id: 'op_03', value: 'top_up_manual', label: 'Thủ công' },
];

const OPTIONS_BALANCE = [
  { id: 'opb_01', value: 'all', label: 'Tất cả' },
  { id: 'opb_02', value: 'profile', label: 'Hồ sơ' },
  { id: 'opb_03', value: 'cash', label: 'Tiền mặt' },
];

// ----------------------------------------------------------------------

export default function RechargeTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

  const handleFilter = useCallback(
    (event) => {
      onFilters(event.target.name, event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (filters.end_date && newValue.getTime() > filters.end_date.getTime()) {
        onFilters('end_date', newValue);
      }
      onFilters('start_date', newValue);
    },
    [filters.end_date, onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (filters.start_date && filters.start_date.getTime() > newValue.getTime()) {
        onFilters('start_date', newValue);
      }
      onFilters('end_date', newValue);
    },
    [filters.start_date, onFilters]
  );

  return (
    <Stack
      sx={{
        p: 2.5,
        pt: 7,
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
        mb={{ xs: 2, lg: 0 }}
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
          }}
        >
          <Iconify icon="solar:money-bag-bold" width={30} color="white" />
        </Stack>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            position: 'relative',
            bottom: -14,
            whiteSpace: 'nowrap',
          }}
        >
          Lịch sử nạp tiền
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{
          mt: 2,
          p: 1,
        }}
      >
        <TextField
          name="search"
          fullWidth
          value={filters.search}
          onChange={(event) => handleFilter(event)}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilter(event), 500)}
          variant="standard"
          placeholder="Tên tài khoản hoặc email được nạp..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="action_user"
          fullWidth
          value={filters.action_user}
          onChange={(event) => handleFilter(event)}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilter(event), 500)}
          variant="standard"
          placeholder="Tên tài khoản hoặc email thực hiện..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, lg: 3 }}
        sx={{
          p: 1,
          width: 1,
        }}
        justifyContent="space-between"
      >
        <TextField
          select
          name="transaction_type_in"
          variant="standard"
          label="Loại nạp tiền"
          value={filters.transaction_type_in}
          sx={{
            width: 1,
          }}
          onChange={(event) => handleFilter(event)}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 160,
                  '&::-webkit-scrollbar': {
                    width: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[500],
                    borderRadius: '4px',
                  },
                },
              },
            },
          }}
        >
          {OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          name="balance_type"
          variant="standard"
          label="Loại số dư"
          value={filters.balance_type}
          sx={{
            width: 1,
          }}
          onChange={(event) => handleFilter(event)}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 160,
                  '&::-webkit-scrollbar': {
                    width: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[500],
                    borderRadius: '4px',
                  },
                },
              },
            },
          }}
        >
          {OPTIONS_BALANCE.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          open={open.start}
          onClose={() => setOpen((prev) => ({ ...prev, start: false }))}
          label="Ngày bắt đầu"
          value={filters.start_date}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'standard',
              placeholder: 'Ngày/Tháng/Năm',
              onClick: () => setOpen((prev) => ({ ...prev, start: true })),
            },
          }}
          sx={{
            width: 1,
          }}
        />

        <DatePicker
          open={open.end}
          onClose={() => setOpen((prev) => ({ ...prev, end: false }))}
          label="Ngày kết thúc"
          value={filters.end_date}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'standard',
              placeholder: 'Ngày/Tháng/Năm',
              onClick: () => setOpen((prev) => ({ ...prev, end: true })),
            },
          }}
          sx={{
            width: 1,
          }}
        />
      </Stack>
    </Stack>
  );
}

RechargeTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
