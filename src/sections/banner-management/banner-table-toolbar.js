import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import Iconify from 'src/components/iconify';
import { Button, InputAdornment, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';

// ----------------------------------------------------------------------

export const IS_ACTIVE_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'true', label: 'Hoạt động' },
  { id: 'false', label: 'Không hoạt động' },
];

export const LINK_TYPE_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'inside', label: 'Mở trên ứng dụng' },
  { id: 'outside', label: 'Mở trên trình duyệt' },
];

export default function BannerTableToolbar({ filters, onFilters, onCreate }) {
  const theme = useTheme();

  const handleFilterTitle = useCallback(
    (event) => {
      onFilters('title', event.target.value);
    },
    [onFilters]
  );

  const handleFilterIsActive = useCallback(
    (event) => {
      onFilters('is_active', event.target.value);
    },
    [onFilters]
  );

  const handleFilterLinkType = useCallback(
    (event) => {
      onFilters('link_type', event.target.value);
    },
    [onFilters]
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
        alignItems="end"
        justifyContent="space-between"
        spacing={1}
        sx={{
          position: 'absolute',
          top: -10,
          left: 24,
          right: 24,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="end">
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
            <Iconify
              icon="material-symbols:planner-banner-ad-pt-outline"
              width={30}
              color="white"
            />
          </Stack>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            whiteSpace="nowrap"
            sx={{
              pb: 1,
            }}
          >
            Quản Lý Banner
          </Typography>
        </Stack>

        <Button
          variant="contained"
          // color="primary"
          startIcon={<Iconify icon="mingcute:add-fill" />}
          onClick={onCreate}
        >
          Tạo banner
        </Button>
      </Stack>

      <TextField
        fullWidth
        color="primary"
        name="title"
        value={filters.title}
        variant="standard"
        onChange={handleFilterTitle}
        // defaultValue={filters.name}
        // onChange={debounce((event) => handleFilterName(event), 500)}
        placeholder="Tiều đề"
        sx={{
          mt: 2,
          p: 1,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
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
          select
          fullWidth
          name="link_type"
          variant="standard"
          label="Loại đường dẫn"
          value={filters.link_type}
          onChange={handleFilterLinkType}
        >
          {LINK_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          name="is_active"
          variant="standard"
          label="Trạng thái"
          value={filters.is_active}
          onChange={handleFilterIsActive}
        >
          {IS_ACTIVE_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

BannerTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  onCreate: PropTypes.func,
  filters: PropTypes.object,
};
