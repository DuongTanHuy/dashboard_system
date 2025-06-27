import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, IconButton, Tooltip, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ filters, onFilters, onReloadData }) {
  const theme = useTheme();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

  const handleFilterId = useCallback(
    (event) => {
      onFilters('id', event.target.value);
    },
    [onFilters]
  );

  const handleFilterName = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterRefererUser = useCallback(
    (event) => {
      onFilters('referer_user', event.target.value);
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
          onClick={onReloadData}
        >
          <Iconify icon="mdi:user" width={30} color="white" />
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
            Quản Lý Tài Khoản
          </Typography>
          <Tooltip title="Làm mới">
            <IconButton onClick={onReloadData}>
              <Iconify icon="ci:arrow-reload-02" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="end"
        justifyContent="space-around"
        width={{ sm: '100%', lg: 'calc(100% - 255px)', xl: 'fit-content' }}
        ml={{ sm: 0, lg: 'auto' }}
      >
        <TextField
          color="primary"
          variant="standard"
          value={filters.id}
          onChange={(event) => handleFilterId(event)}
          // defaultValue={filters.id}
          // onChange={debounce((event) => handleFilterId(event), 500)}
          placeholder="ID tài khoản"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 190 },
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
          value={filters.search}
          onChange={(event) => handleFilterName(event)}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Email hoặc tên tài khoản"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 190 },
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
          value={filters.referer_user}
          onChange={(event) => handleFilterRefererUser(event)}
          // defaultValue={filters.referer_user}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Người giới thiệu"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 190 },
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

UserTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  onReloadData: PropTypes.func,
  filters: PropTypes.object,
};
