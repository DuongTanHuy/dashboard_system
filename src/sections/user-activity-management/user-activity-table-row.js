import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ACT_TYPE } from './user-activity-table-toolbar';

// ----------------------------------------------------------------------

export default function UserActivityTableRow({ no, row, setDataExtraId }) {
  const { id, user, workspace, cms_user, profile, activity_type, transaction, created_at } = row;

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
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user?.username ?? cms_user?.username}
          secondary={user?.email ?? cms_user?.email}
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
        {workspace?.id}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {workspace?.name}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {profile?.id}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {profile?.name}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {ACT_TYPE.find((act) => act.value === activity_type)?.label}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {transaction?.amount ? `${transaction?.amount} Hồ sơ` : ''}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {transaction?.balance_after_transaction
          ? `${transaction?.balance_after_transaction} Hồ sơ`
          : ''}
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
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <IconButton onClick={() => setDataExtraId(id)}>
          <Iconify icon="lsicon:view-filled" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

UserActivityTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
  setDataExtraId: PropTypes.func,
};
