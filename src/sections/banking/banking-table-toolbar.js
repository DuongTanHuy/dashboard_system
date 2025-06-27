import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import { Button, InputAdornment, MenuItem, TextField, Typography, alpha } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { bgGradient } from 'src/theme/css';
import { useTheme } from '@emotion/react';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export const OPTIONS_TYPE = [
  { id: 'opb_01', value: 'receive', label: 'Nhận tiền' },
  { id: 'opb_02', value: 'send_out', label: 'Chuyển tiền' },
];

export default function BankingTableToolbar({ filters, onFilters }) {
  const theme = useTheme();
  const [open, setOpen] = useState({
    start: false,
    end: false,
  });

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

  const handleFilterDetail = useCallback(
    (event) => {
      onFilters('description', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (event) => {
      onFilters('type', event.target.value);
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
          }}
        >
          <Iconify icon="mingcute:bank-fill" width={30} color="white" />
        </Stack>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            position: 'relative',
            bottom: -14,
          }}
        >
          Lịch sử giao dịch ngân hàng
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems="end"
        justifyContent="space-around"
        width={{ sm: '100%', lg: 'calc(100% - 300px)' }}
        ml={{ sm: 0, lg: 'auto' }}
      >
        <TextField
          fullWidth
          color="primary"
          variant="standard"
          value={filters.description}
          onChange={handleFilterDetail}
          placeholder="Mô tả"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: 1, lg: 240 },
          }}
        />

        <TextField
          fullWidth
          select
          variant="standard"
          label="Loại giao dịch"
          value={filters.type}
          sx={{
            width: { xs: 1, lg: 240 },
          }}
          onChange={(event) => handleFilterType(event)}
        >
          {OPTIONS_TYPE.map((option) => (
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
            width: { xs: 1, lg: 240 },
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
            width: { xs: 1, lg: 240 },
          }}
        />
      </Stack>
    </Stack>
  );
}

BankingTableToolbar.propTypes = {
  onFilters: PropTypes.func,
  filters: PropTypes.object,
};
