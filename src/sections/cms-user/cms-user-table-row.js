import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
import { Avatar, Divider, IconButton, MenuItem, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { useAuthContext } from 'src/auth/hooks';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { useDeleteCmsUse } from 'src/tanstack/use-cms-user';
import { LoadingButton } from '@mui/lab';
import UpdateUserDialog from './update-user-dialog';

// ----------------------------------------------------------------------

export default function CmsUserTableRow({ no, row }) {
  const {
    id,
    avatar_url,
    username,
    first_name,
    last_name,
    email,
    role,
    country,
    city,
    address,
    created_at,
    phone,
  } = row;

  const popover = usePopover();
  const show = useBoolean();
  const confirm = useBoolean();

  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

  const { mutate, isPending } = useDeleteCmsUse();

  const handleDeleteUser = () => {
    mutate(id, {
      onSuccess: () => {
        enqueueSnackbar('Xóa tài khoản thành công!', { variant: 'success' });
        confirm.onFalse();
      },
      onError: (error) => {
        if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
          enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
        } else if (error?.error_code === ERROR_CODE.CANNOT_DELETE_SUPER_ADMIN) {
          enqueueSnackbar('Không thể xóa tài khoản super admin!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xóa tài khoản thất bại!', { variant: 'error' });
        }
        confirm.onFalse();
      },
    });
  };

  return (
    <>
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
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            alt={username}
            src={avatar_url}
            variant="rounded"
            sx={{ width: 55, height: 55, mr: 2 }}
          >
            {(username || '').charAt(0).toUpperCase()}
          </Avatar>
          <ListItemText
            primary={`${first_name || ''} ${last_name || ''}`}
            secondary={email}
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
          {username}
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
          align="center"
        >
          <ListItemText
            primary={`${country || ''} - ${city || ''}`}
            secondary={address}
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
          <Label variant="soft" color="primary">
            {role.replace(/_/g, ' ')}
          </Label>
        </TableCell>

        <TableCell
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          {phone}
        </TableCell>
        {isPermission && (
          <TableCell
            align="center"
            sx={{
              typography: 'subtitle2',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.role === 'super_admin' && (
              <Tooltip title="Cập nhật thông tin" placement="top">
                <IconButton onClick={show.onTrue} disabled={!isPermission}>
                  <Iconify icon="fluent:edit-16-filled" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={popover.onOpen} disabled={!isPermission}>
              <Iconify icon="ri:more-2-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem chi tiết
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="material-symbols-light:delete" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <UpdateUserDialog open={show.value} onClose={show.onFalse} userInfo={row} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa tài khoản"
        content={<>Bạn chắc chắn muốn xóa tài khoản này?</>}
        action={
          <LoadingButton
            loading={isPending}
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteUser();
            }}
          >
            Xóa ngay
          </LoadingButton>
        }
      />
    </>
  );
}

CmsUserTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
};
