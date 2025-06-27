import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fCurrencyVND } from 'src/utils/format-number';
import { Box, IconButton, MenuItem, Stack, Tooltip } from '@mui/material';
import Label from 'src/components/label';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover from 'src/components/custom-popover/custom-popover';

// ----------------------------------------------------------------------

export default function ReconciliationTableRow({ row, onShowReconciliationDetail, onPayment }) {
  const { code, user, amount, start_date, end_date, payment_status, payment_info, note } = row;
  const [noteRef, showNote] = useTooltipNecessity();

  const paymentInfo = (payment_info || '').split('/');

  const popover = usePopover();

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
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {`#${code}`}
        </Box>
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

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
        align="center"
      >
        {fCurrencyVND(amount)}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {`${format(new Date(start_date), 'dd/MM/yyyy')} - ${format(
          new Date(end_date),
          'dd/MM/yyyy'
        )}`}
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={getColorByStatus(payment_status)}>
          {(payment_status === 'pending' && 'Chờ thanh toán') ||
            (payment_status === 'paid' && 'Đã thanh toán') ||
            'Chưa thanh toán'}
        </Label>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={paymentInfo?.length > 2 && `${paymentInfo[1]} / ${paymentInfo[0]}`}
          secondary={paymentInfo.length > 2 && paymentInfo[2]}
          primaryTypographyProps={{ typography: 'subtitle2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          maxWidth: 190,
        }}
      >
        <Stack>
          <Tooltip title={showNote ? note : ''}>
            <TextMaxLine
              ref={noteRef}
              display={note?.includes(' ') ? '-webkit-box' : 'inline-block'}
              line={2}
            >
              {note}
            </TextMaxLine>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="ri:more-2-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onShowReconciliationDetail();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          Xem chi tiết
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onPayment();
          }}
          disabled={payment_status === 'paid'}
        >
          <Iconify icon="fluent:payment-20-filled" />
          Thanh toán
        </MenuItem>
      </CustomPopover>
    </TableRow>
  );
}

ReconciliationTableRow.propTypes = {
  row: PropTypes.object,
  onShowReconciliationDetail: PropTypes.func,
  onPayment: PropTypes.func,
};
