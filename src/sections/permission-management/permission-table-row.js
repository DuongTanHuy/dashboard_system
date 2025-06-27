import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import TextMaxLine from 'src/components/text-max-line';
import { format } from 'date-fns';
import { Divider, IconButton, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PermissionTableRow({ row, onDelete, onUpdate }) {
  const { id, name, slug, description, created_at, updated_at, parent } = row;
  const popover = usePopover();

  return (
    <TableRow hover>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {id}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {name}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          maxWidth: 360,
        }}
      >
        <TextMaxLine line={2}>{description}</TextMaxLine>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {slug}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {parent?.name && <Label color="primary">{parent?.name}</Label>}
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
        <ListItemText
          primary={format(new Date(updated_at), "d 'tháng' M yyyy")}
          secondary={format(new Date(updated_at), 'p')}
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
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="ri:more-2-fill" />
        </IconButton>
      </TableCell>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'fit-content' }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onUpdate();
          }}
        >
          <Iconify icon="icon-park-solid:transaction-order" />
          Cập nhật
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete(parent?.id ? 'permission' : 'group');
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="ph:package-fill" />
          Xóa
        </MenuItem>
      </CustomPopover>
    </TableRow>
  );
}

PermissionTableRow.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
