import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrencyVND } from 'src/utils/format-number';
import { IconButton, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { PACKAGE } from 'src/utils/constance';
import Label from 'src/components/label';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { useMultiBoolean } from 'src/hooks/use-multiple-boolean';
import UpdateRefererDialog from './update-referer-dialog';
import UpdateEmailDialog from './update-email-dialog';

// ----------------------------------------------------------------------

export default function UserTableRow({ no, row, handleOpenDialog, handleOpenUpdatePackage }) {
  const {
    id,
    username,
    referer: refererInfo,
    email: emailInfo,
    created_at,
    balance,
    profile_balance,
    profile_package,
    affiliate_level,
  } = row;
  const [referer, setReferer] = useState(refererInfo);
  const [email, setEmail] = useState(emailInfo);
  const popover = usePopover();
  const open = useMultiBoolean({
    referer: false,
    email: false,
  });

  const packageName = PACKAGE.find((item) => item.id === profile_package)?.name;

  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

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
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={username}
          secondary={email}
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
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {affiliate_level?.level ?? 'Novice'}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {fCurrencyVND(balance)}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {`${profile_balance || 0} hồ sơ`}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Label variant="outlined" color="primary">
          {packageName || 'Free'}
        </Label>
      </TableCell>
      {isPermission && (
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
      )}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'fit-content' }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleOpenDialog();
          }}
        >
          <Iconify icon="icon-park-solid:transaction-order" />
          Cập nhật số dư
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleOpenUpdatePackage();
          }}
        >
          <Iconify icon="ph:package-fill" />
          Cập nhật gói
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            open.onTrue('email');
          }}
        >
          <Iconify icon="mdi:email-sync" />
          Chỉnh sửa email
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            open.onTrue('referer');
          }}
        >
          <Iconify icon="f7:person-2-fill" />
          {`${referer?.username ? 'Cập nhật' : 'Thêm'} người giới thiệu`}
        </MenuItem>
      </CustomPopover>

      <UpdateRefererDialog
        userId={id}
        open={open.value.referer}
        mode={referer?.username ? 'update' : 'add'}
        onClose={() => open.onFalse('referer')}
        setRefererData={setReferer}
      />

      <UpdateEmailDialog
        userId={id}
        open={open.value.email}
        onClose={() => open.onFalse('email')}
        emailInfo={email}
        setEmailData={setEmail}
      />
    </TableRow>
  );
}

UserTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
  handleOpenDialog: PropTypes.func,
  handleOpenUpdatePackage: PropTypes.func,
};
