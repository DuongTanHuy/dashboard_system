import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { Button, InputAdornment, MenuItem, TextField, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';
import { debounce } from 'lodash';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { id: 'st_01', value: 'all', label: 'Tất cả' },
  { id: 'st_02', value: 'alive', label: 'Còn hạn' },
  { id: 'st_03', value: 'expired', label: 'Hết hạn' },
];

export const DELETE_STATUS = [
  { id: 'ds_01', value: 'all', label: 'Tất cả' },
  { id: 'ds_02', value: 'undeleted', label: 'Chưa xóa' },
  { id: 'ds_03', value: 'deleted', label: 'Đã xóa' },
];

// ----------------------------------------------------------------------

export default function ListProfileTableToolbar({ filters, onFilters }) {
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
          <Iconify icon="material-symbols:lab-profile" width={30} color="white" />
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
          Danh cách hồ sơ
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, lg: 3 }}
        alignItems="center"
        sx={{
          p: 1,
          mt: 2,
          width: 1,
        }}
      >
        <TextField
          variant="standard"
          name="profile_id"
          defaultValue={filters.profile_id}
          onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="ID hồ sơ"
          sx={{
            width: 1,
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
          variant="standard"
          name="ws_id"
          defaultValue={filters.ws_id}
          onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="ID workspace"
          sx={{
            width: 1,
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
          fullWidth
          variant="standard"
          name="profile"
          // value={filters.profile}
          // onChange={(event) => handleFilter(event)}
          defaultValue={filters.profile}
          onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="Tên hồ sơ"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          variant="standard"
          name="profile_group_id"
          defaultValue={filters.profile_group_id}
          onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="ID nhóm hồ sơ"
          sx={{
            width: 1,
          }}
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
        direction={{ sm: 'column', md: 'row' }}
        spacing={{ xs: 2, lg: 3 }}
        justifyContent="space-between"
        alignItems="end"
        sx={{
          p: 1,
          width: 1,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          name="name"
          value={filters.name}
          onChange={(event) => handleFilter(event)}
          // defaultValue={filters.name}
          // onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="Email hoặc tên người tạo"
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
          variant="standard"
          name="user_owner"
          value={filters.user_owner}
          onChange={(event) => handleFilter(event)}
          // defaultValue={filters.name}
          // onChange={debounce((event) => handleFilter(event), 500)}
          placeholder="Email hoặc tên người sở hữu"
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
          name="status"
          variant="standard"
          label="Thời hạn"
          value={filters.status}
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
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          name="delete_status"
          variant="standard"
          label="Trạng thái xóa"
          value={filters.delete_status}
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

ListProfileTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
