import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import { Button, Typography, alpha } from '@mui/material';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';

// ----------------------------------------------------------------------

export default function AffiliateTableToolbar({ filters, onFilters }) {
  const theme = useTheme();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
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
          <Iconify icon="teenyicons:share-solid" width={30} color="white" />
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
            Quản Lý Liên Kết
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems="end"
        justifyContent="flex-end"
        width={{ sm: '100%', lg: 'calc(100% - 320px)', xl: 'fit-content' }}
        ml={{ sm: 0, lg: 'auto' }}
      >
        <TextField
          color="primary"
          variant="standard"
          value={filters.search}
          onChange={handleFilterName}
          // defaultValue={filters.search}
          // onChange={debounce((event) => handleFilterName(event), 500)}
          placeholder="Email hoặc tên tài khoản"
          sx={{
            mt: { xs: 3, sm: 0 },
            width: { xs: '100%', lg: 260 },
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
      </Stack>
    </Stack>
  );
}

AffiliateTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
