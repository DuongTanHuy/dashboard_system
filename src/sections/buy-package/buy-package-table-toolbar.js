import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import Iconify from 'src/components/iconify';
import { Button, InputAdornment, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function BuyPackageTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

  const handleSetSearchParam = useCallback(
    (name, value) => {
      searchParams.set(name, value);
      searchParams.delete('page');
      router.push(`${paths.dashboard.transaction_history.buy_package}?${searchParams}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (event) => {
      onFilters('search', event.target.value);
      handleSetSearchParam('search', event.target.value);
    },
    [handleSetSearchParam, onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (filters.end_date && newValue.getTime() > filters.end_date.getTime()) {
        onFilters('end_date', newValue);
        handleSetSearchParam('end_date', fDate(newValue, 'yyyy-MM-dd'));
      }
      onFilters('start_date', newValue);
      handleSetSearchParam('start_date', fDate(newValue, 'yyyy-MM-dd'));
    },
    [filters.end_date, handleSetSearchParam, onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (filters.start_date && filters.start_date.getTime() > newValue.getTime()) {
        onFilters('start_date', newValue);
        handleSetSearchParam('start_date', fDate(newValue, 'yyyy-MM-dd'));
      }
      onFilters('end_date', newValue);
      handleSetSearchParam('end_date', fDate(newValue, 'yyyy-MM-dd'));
    },
    [filters.start_date, handleSetSearchParam, onFilters]
  );

  return (
    <Stack
      spacing={{ xs: 0, sm: 1 }}
      sx={{
        p: 2.5,
        pt: 9,
        transition: theme.transitions.create('all', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
      }}
      position="relative"
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
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
          <Iconify icon="material-symbols-light:package-2" width={30} color="white" />
        </Stack>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            position: 'relative',
            bottom: -14,
          }}
        >
          Lịch sử mua gói
        </Typography>
      </Stack>

      <TextField
        fullWidth
        value={filters.search}
        onChange={(event) => handleSearch(event)}
        // defaultValue={filters.search}
        // onChange={debounce((event) => handleSearch(event), 500)}
        variant="standard"
        placeholder="Tên tài khoản hoặc email..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          p: 1,
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, md: 3 }}
        sx={{
          width: { xs: 1, md: 0.5 },
        }}
        p={1}
        pt={0}
      >
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
        />
      </Stack>
    </Stack>
  );
}

BuyPackageTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
