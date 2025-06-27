import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';
import { DELETE_STATUS } from '../profile/list-table-toolbar';

// ----------------------------------------------------------------------

export default function WorkspaceTableToolbar({ filters, onFilters }) {
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

  const handleFilterWorkspace = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterName = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  const handleFilterDeleteStatus = useCallback(
    (event) => {
      onFilters('delete_status', event.target.value);
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
            '&:hover': {
              boxShadow: 'none',
              transform: 'scale(0.94)',
            },
            transition: theme.transitions.create(['all'], {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <Iconify icon="fluent:align-space-evenly-horizontal-24-filled" width={30} color="white" />
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
            Quản Lý Không Gian Làm Việc
          </Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          mt: 2,
          p: 1,
        }}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
      >
        <TextField
          fullWidth
          color="primary"
          variant="standard"
          value={filters.id}
          onChange={handleFilterId}
          // defaultValue={filters.id}
          // onChange={debounce((event) => handleFilterId(event), 500)}
          placeholder="ID workspace"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          color="primary"
          variant="standard"
          value={filters.name}
          onChange={handleFilterWorkspace}
          // defaultValue={filters.id}
          // onChange={debounce((event) => handleFilterId(event), 500)}
          placeholder="Tên workspace"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          color="primary"
          variant="standard"
          value={filters.search}
          onChange={handleFilterName}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Email hoặc tên người tạo"
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
          fullWidth
          select
          name="delete_status"
          variant="standard"
          label="Trạng thái xóa"
          value={filters.delete_status}
          sx={{
            width: 1,
            '& input': {
              padding: 0,
              height: 40,
              mt: '4px',
            },
          }}
          onChange={handleFilterDeleteStatus}
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
          {DELETE_STATUS.map((option) => (
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

WorkspaceTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
