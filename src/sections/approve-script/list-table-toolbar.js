import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { Button, InputAdornment, MenuItem, TextField, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export default function ListScriptTableToolbar({ filters, onFilters, category }) {
  const theme = useTheme();
  // const searchParams = useSearchParams();
  // const router = useRouter();
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
            '&:hover': {
              boxShadow: 'none',
              transform: 'scale(0.94)',
            },
            transition: theme.transitions.create(['all'], {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <Iconify icon="ph:code-fill" width={30} color="white" />
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
          Danh cách script
        </Typography>
      </Stack>
      <Stack
        sx={{
          mt: 2,
          p: 1,
        }}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
      >
        {filters.user_created === undefined ? (
          <TextField
            fullWidth
            color="primary"
            variant="standard"
            name="name"
            value={filters.name}
            onChange={handleFilter}
            // defaultValue={filters.search}
            // onChange={debounce((event) => handleFilter(event), 500)}
            placeholder="Tên script"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <TextField
            fullWidth
            color="primary"
            variant="standard"
            name="user_created"
            value={filters.user_created}
            onChange={handleFilter}
            // defaultValue={filters.search}
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
        )}
        {filters.search !== undefined ? (
          <TextField
            fullWidth
            color="primary"
            variant="standard"
            name="search"
            value={filters.search}
            onChange={handleFilter}
            // defaultValue={filters.search}
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
        ) : (
          <TextField
            fullWidth
            color="primary"
            variant="standard"
            name="user_owner"
            value={filters.user_owner}
            onChange={handleFilter}
            // defaultValue={filters.search}
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
        )}
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
        {filters.workflow_category_id !== undefined ? (
          <TextField
            select
            name="workflow_category_id"
            variant="standard"
            label="Danh mục"
            value={filters.workflow_category_id}
            onChange={(event) => handleFilter(event)}
            sx={{
              width: 1,
              '& input': {
                padding: 0,
                height: 40,
              },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                  },
                },
              },
            }}
          >
            {category.map((option) => (
              <MenuItem key={option.id} value={`${option.id}-${option.name}`}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Stack width={1} direction="row" spacing={2} alignItems="end">
            <TextField
              fullWidth
              color="primary"
              variant="standard"
              name="name"
              value={filters.name}
              onChange={handleFilter}
              // defaultValue={filters.search}
              // onChange={debounce((event) => handleFilter(event), 500)}
              placeholder="Tên script"
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
              name="type"
              variant="standard"
              label="Loại script"
              value={filters.type}
              onChange={(event) => handleFilter(event)}
              sx={{
                width: 1,
                '& input': {
                  padding: 0,
                  height: 40,
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 240,
                    },
                  },
                },
              }}
            >
              {category.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}

        <Stack width={1} direction="row" alignItems="end" spacing={2}>
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
    </Stack>
  );
}

ListScriptTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
  category: PropTypes.array,
};
