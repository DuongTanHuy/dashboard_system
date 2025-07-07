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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export default function ProfileGroupTableToolbar({ filters, onFilters }) {
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
          <Iconify icon="ph:devices-duotone" width={30} color="white" />
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
          Quản Lý Thiết Bị Đăng Nhập
        </Typography>
      </Stack>

      <TextField
        name="username"
        fullWidth
        value={filters.username}
        onChange={handleFilter}
        // defaultValue={filters.search}
        // onChange={debounce((event) => handleFilter(event), 500)}
        variant="standard"
        placeholder="Tên hoặc email tài khoản đăng nhập"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mt: 2,
          p: 1,
        }}
      />

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
          color="primary"
          variant="standard"
          name="hostname"
          value={filters.hostname}
          onChange={handleFilter}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Tên thiết bị"
          sx={{
            width: 1,
            '& input': {
              padding: 0,
              height: 40,
              mt: '4px',
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
          name="ip"
          value={filters.ip}
          onChange={handleFilter}
          placeholder="Địa chỉ IP"
          sx={{
            width: 1,
            '& input': {
              padding: 0,
              height: 40,
              mt: '4px',
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

ProfileGroupTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
