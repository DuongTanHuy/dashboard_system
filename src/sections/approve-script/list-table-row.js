import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fCurrencyVND } from 'src/utils/format-number';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import { Divider, IconButton, MenuItem, Tooltip } from '@mui/material';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { deletePublicWorkflowApi } from 'src/api/workflow.api';

// ----------------------------------------------------------------------

export default function ListScriptTableRow({ no, row, handleReloadData, onShare, isSuperAdmin }) {
  const { id, name, description, type, created_at, updated_at, user_created } = row;

  const router = useRouter();
  const [detailRef, showDetail] = useTooltipNecessity();
  const [nameRef, showName] = useTooltipNecessity();
  const popover = usePopover();
  const confirm = useBoolean();

  const [loading, setLoading] = useState(false);

  const handleDeleteScript = async () => {
    try {
      setLoading(true);

      const response = await deletePublicWorkflowApi(id);

      if (response?.data?.error_code) {
        throw new Error('Không thể xóa script đang chờ duyệt!');
      }

      handleReloadData();
      enqueueSnackbar('Xóa script thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar(error?.message || 'Xóa script thất bại!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
      confirm.onFalse();
    }
  };

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
          minWidth: 200,
        }}
      >
        <Tooltip title={showName ? name : ''}>
          <TextMaxLine ref={nameRef} line={2}>
            {name}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          minWidth: 300,
        }}
      >
        <Tooltip title={showDetail ? description : ''}>
          <TextMaxLine ref={detailRef} line={2}>
            {description}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user_created?.username || ''}
          secondary={user_created?.email || ''}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      {row?.user_owner !== undefined && (
        <TableCell
          sx={{
            typography: 'subtitle2',
          }}
        >
          <ListItemText
            primary={row.user_owner?.username || ''}
            secondary={row.user_owner?.email || ''}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      )}

      {row?.workflow_category !== undefined && (
        <TableCell
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          {row.workflow_category?.name}
        </TableCell>
      )}

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
        <Label variant="soft" color={type === 'flowchart' ? 'secondary' : 'warning'}>
          {type}
        </Label>
      </TableCell>

      {row?.usage_fee !== undefined && (
        <TableCell
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          {fCurrencyVND(row.usage_fee)}
        </TableCell>
      )}

      {row?.status !== undefined && (
        <TableCell
          align="center"
          sx={{
            typography: 'subtitle2',
          }}
        >
          <Label
            color={
              (row.status === 'pending' && 'warning') ||
              (row.status === 'approved' && 'success') ||
              'error'
            }
          >
            {(row.status === 'approved' && 'Đã chấp nhận') ||
              (row.status === 'rejected' && 'Đã từ chối') ||
              'Đang chờ duyệt'}
          </Label>
        </TableCell>
      )}

      <TableCell align="center">
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
            router.push(
              `${
                row?.status !== undefined
                  ? paths.dashboard.script.approveDetail
                  : paths.dashboard.script.listDetail
              }/${id}`
            );
          }}
        >
          <Iconify icon="solar:eye-bold-duotone" />
          Xem script
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onShare();
          }}
        >
          <Iconify icon="solar:share-linear" />
          Chia sẻ quy trình
        </MenuItem>

        {isSuperAdmin && (
          <>
            <Divider />

            <MenuItem
              onClick={() => {
                popover.onClose();
                confirm.onTrue();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="material-symbols-light:delete" />
              Xóa
            </MenuItem>
          </>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa script?"
        content="Bạn có chắc chắn muốn xóa script này không?"
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="error"
            onClick={handleDeleteScript}
          >
            Xóa ngay
          </LoadingButton>
        }
      />
    </TableRow>
  );
}

ListScriptTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
  handleReloadData: PropTypes.func,
  onShare: PropTypes.func,
  isSuperAdmin: PropTypes.bool,
};
