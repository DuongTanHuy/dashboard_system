import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import Iconify from 'src/components/iconify';
import { Button, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

const OPTIONS_BALANCE = [
  { id: 'opb_01', value: 'all', label: 'Tất cả' },
  { id: 'opb_02', value: 'profile', label: 'Hồ sơ' },
  { id: 'opb_03', value: 'cash', label: 'Tiền mặt' },
];

// ----------------------------------------------------------------------

export default function DeductionTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

  const handleFilter = useCallback(
    (event) => {
      searchParams.set(event.target.name, event.target.value);
      searchParams.delete('page');
      router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
      onFilters(event.target.name, event.target.value);
    },
    [onFilters, router, searchParams]
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
        pt: { xs: 8, md: 2 },
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
          }}
        >
          <Iconify icon="fluent-emoji-high-contrast:money-with-wings" width={30} color="white" />
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
          Lịch sử trừ tiền
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mt: { xs: 3, md: 0 },
        }}
        justifyContent={{ xs: 'space-around', md: 'flex-end' }}
        width={{ sm: '100%', lg: 'auto' }}
      >
        <TextField
          select
          name="balance_type"
          variant="standard"
          label="Loại số dư"
          value={filters.balance_type}
          sx={{
            width: { xs: '100%', md: 160 },
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
            width: { xs: 1, md: 160 },
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
            width: { xs: 1, md: 160 },
          }}
        />
      </Stack>
    </Stack>
  );
}

DeductionTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
