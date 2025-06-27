import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, Divider, MenuItem, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';

// ----------------------------------------------------------------------

export default function PermissionTableToolbar({ filters, onFilters, onCreate, groupPermission }) {
  const theme = useTheme();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterParent = useCallback(
    (event) => {
      onFilters('parent', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      sx={{
        p: 2.5,
        pt: { xs: 12, sm: 2 },
        transition: theme.transitions.create('all', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
        mb: 13,
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
            <Iconify icon="icon-park-twotone:permissions" width={30} color="white" />
          </Stack>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            whiteSpace="nowrap"
            sx={{
              pb: 1,
            }}
          >
            Quản Lý Quyền
          </Typography>
        </Stack>

        <Button
          variant="contained"
          // color="primary"
          startIcon={<Iconify icon="mingcute:add-fill" />}
          onClick={onCreate}
        >
          Thêm quyền
        </Button>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 3 }}
        alignItems="end"
        justifyContent="space-between"
        sx={{
          position: 'absolute',
          top: 74,
          left: 24,
          right: 24,
        }}
      >
        <TextField
          color="primary"
          variant="standard"
          value={filters.name}
          onChange={handleFilterName}
          // defaultValue={filters.name}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Tên quyền"
          sx={{
            mt: { xs: 2, sm: 0 },
            width: { xs: '100%', lg: 1 },
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
          select
          label="Nhóm quyền"
          color="primary"
          variant="standard"
          name="parent"
          value={filters.parent}
          onChange={handleFilterParent}
          sx={{
            width: 1,
            '& .MuiInputBase-root': {
              mt: '14px',
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
          <MenuItem
            value="null"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
            }}
          >
            Các nhóm quyền
          </MenuItem>
          <Divider />
          {groupPermission.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

PermissionTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  onCreate: PropTypes.func,
  groupPermission: PropTypes.array,
  filters: PropTypes.object,
};
