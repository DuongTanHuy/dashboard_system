import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrencyVND } from 'src/utils/format-number';
import { ERROR_CODE, PACKAGE } from 'src/utils/constance';
import Label from 'src/components/label';
import { IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { LoadingButton } from '@mui/lab';
import { useDeleteTransaction } from 'src/tanstack/use-transaction';

// ----------------------------------------------------------------------

export default function BuyPackageTableRow({ no, row }) {
  const { user: userInfo } = useAuthContext();
  const isPermission = userInfo?.role !== 'employee';

  const { id, user, package: currPackage, amount, created_at, discount, discount_type } = row;
  const confirm = useBoolean();

  const packageName = PACKAGE.find((item) => item.id === currPackage)?.name;

  const { mutate, isPending } = useDeleteTransaction();

  const handleDeletePackage = async () => {
    mutate(id, {
      onSuccess: () => {
        enqueueSnackbar('Xóa gói thành công!', { variant: 'success' });
        confirm.onFalse();
      },
      onError: (error) => {
        if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
          enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xóa gói thất bại!', { variant: 'error' });
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
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          <Label variant="outlined" color="primary">
            {packageName || 'Free'}
          </Label>
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
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          {
            // eslint-disable-next-line no-nested-ternary
            discount_type
              ? discount_type === 'percentage'
                ? `-${fCurrencyVND((amount * discount) / 100)}`
                : `-${fCurrencyVND(discount)}`
              : ''
          }
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
        {isPermission && (
          <TableCell align="center">
            <Tooltip title="Xóa gói" placement="top">
              <IconButton onClick={confirm.onTrue}>
                <Iconify icon="fluent:delete-20-filled" />
              </IconButton>
            </Tooltip>
          </TableCell>
        )}
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa gói"
        content={<>Bạn chắc chắn muốn xóa lịch sử mua gói này?</>}
        action={
          <LoadingButton
            loading={isPending}
            variant="contained"
            color="error"
            onClick={() => {
              handleDeletePackage();
            }}
          >
            Xóa ngay
          </LoadingButton>
        }
      />
    </>
  );
}

BuyPackageTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
};
