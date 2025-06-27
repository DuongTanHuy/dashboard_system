import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrencyVND, fNumber } from 'src/utils/format-number';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export default function RechargeTableRow({ no, row, handleOpenDialog }) {
  const {
    id,
    amount,
    transaction_type,
    user,
    action_user,
    balance_type,
    balance_after_transaction,
    note,
    created_at,
  } = row;

  const isProfileBalance = balance_type === 'profile';

  const [noteRef, showNote] = useTooltipNecessity();

  return (
    <TableRow hover>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {no}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {id}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Label variant="soft" color="primary">
          {transaction_type.replace(/_/g, ' ')}
        </Label>
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
      >
        <ListItemText
          primary={action_user?.username}
          secondary={action_user?.email}
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
        {isProfileBalance ? `${fNumber(amount)} hồ sơ` : fCurrencyVND(amount)}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {isProfileBalance
          ? `${fNumber(balance_after_transaction)} hồ sơ`
          : fCurrencyVND(balance_after_transaction)}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          maxWidth: 190,
        }}
      >
        <Tooltip title={showNote ? note : ''}>
          <TextMaxLine ref={noteRef} line={2}>
            {note}
          </TextMaxLine>
        </Tooltip>
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
    </TableRow>
  );
}

RechargeTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
  handleOpenDialog: PropTypes.func,
};
