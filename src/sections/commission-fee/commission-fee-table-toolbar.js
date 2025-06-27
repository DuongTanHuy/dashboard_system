import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function CommissionFeeTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

  const handleFilterCode = useCallback(
    (event) => {
      onFilters('code', event.target.value);
    },
    [onFilters]
  );

  const handleFilterReferer = useCallback(
    (event) => {
      onFilters('referer_username', event.target.value);
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
          <Iconify icon="game-icons:profit" width={30} color="white" />
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
            Quản Lý Hoa Hồng
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems="end"
        justifyContent="space-around"
        width={{ sm: '100%', lg: 'calc(100% - 320px)', xl: 'fit-content' }}
        ml={{ sm: 0, lg: 'auto' }}
      >
        <TextField
          color="primary"
          variant="standard"
          value={filters.referer_username}
          onChange={handleFilterReferer}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Người nhận"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 200 },
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
          // defaultValue={filters.id}
          // onChange={debounce((event) => handleFilterId(event), 500)}
          placeholder="Mã đối soát"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 200 },
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
            width: { xs: 1, lg: 'fit-content' },
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
            width: { xs: 1, lg: 'fit-content' },
          }}
        />
      </Stack>
    </Stack>
  );
}

CommissionFeeTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
