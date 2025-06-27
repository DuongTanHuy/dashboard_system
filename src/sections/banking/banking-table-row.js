import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrencyVND } from 'src/utils/format-number';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import { Checkbox, Tooltip } from '@mui/material';
import { OPTIONS_TYPE } from 'src/sections/banking/banking-table-toolbar';

// ----------------------------------------------------------------------

export default function BankingTableRow({ no, row, selected, onSelectRow }) {
  const { created_at, amount, transaction_number, description, type, bank_type } = row;

  const [desRef, showDes] = useTooltipNecessity();

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
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
        {transaction_number}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {fCurrencyVND(amount)}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
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
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Tooltip title={showDes ? description : ''}>
          <TextMaxLine ref={desRef} line={2}>
            {description}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Label variant="soft" color="primary">
          {OPTIONS_TYPE.find((option) => option.value === type)?.label || ''}
        </Label>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Label variant="outlined" color="primary">
          {bank_type === 'acb' ? 'ACB' : 'Vietcombank'}
        </Label>
      </TableCell>
    </TableRow>
  );
}

BankingTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
};
