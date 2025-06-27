import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
import { fCurrencyVND } from 'src/utils/format-number';
import Label from 'src/components/label';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

export default function CommissionFeeTableRow({ row }) {
  const {
    reconciliation,
    referer,
    user,
    transaction_history,
    created_at,
    commission_percent,
    payment_status,
  } = row;

  const getCommission = useCallback((transaction_history_val, commission_percent_val) => {
    const { amount, discount_type, discount } = transaction_history_val;

    if (discount_type === 'percentage') {
      return ((amount - amount * (discount / 100)) * commission_percent_val) / 100;
    }

    if (discount_type === 'amount') {
      return ((amount - discount) * commission_percent_val) / 100;
    }

    return (amount * commission_percent_val) / 100;
  }, []);

  const getAmount = useCallback((transaction_history_val) => {
    const { amount, discount_type, discount } = transaction_history_val;

    if (discount_type === 'percentage') {
      return amount - amount * (discount / 100);
    }

    if (discount_type === 'amount') {
      return amount - discount;
    }

    return amount;
  }, []);

  const getColorByStatus = (sta) => {
    switch (sta) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            typography: 'subtitle2',
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {`#${reconciliation?.code}`}
        </Box>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={referer?.username}
          secondary={referer?.email}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user?.username}
          secondary={user?.email}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(created_at), "d 'tháng' M yyyy")}
          secondary={format(new Date(created_at), 'p')}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {fCurrencyVND(getAmount(transaction_history))}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {`${commission_percent}%`}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {fCurrencyVND(getCommission(transaction_history, commission_percent))}{' '}
      </TableCell>
      <TableCell align="center">
        <Label variant="soft" color={getColorByStatus(payment_status)}>
          {(payment_status === 'pending' && 'Chờ thanh toán') ||
            (payment_status === 'paid' && 'Đã thanh toán') ||
            'Chưa thanh toán'}
        </Label>
      </TableCell>
    </TableRow>
  );
}

CommissionFeeTableRow.propTypes = {
  row: PropTypes.object,
};
