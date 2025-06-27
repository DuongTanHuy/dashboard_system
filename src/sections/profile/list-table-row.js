import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextMaxLine from 'src/components/text-max-line';
import {
  Checkbox,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { useBoolean } from 'src/hooks/use-boolean';
import { useState } from 'react';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { format } from 'date-fns';
import { deleteProfileApi, restoreProfileApi } from 'src/api/profile.api';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

// ----------------------------------------------------------------------

export default function ListProfileTableRow({
  row,
  selected,
  onSelectRow,
  handleReloadData,
  isSuperAdmin,
  isEmployee,
  onTransfer,
}) {
  const {
    id,
    profile_hash,
    workspace,
    group_name,
    deleted_at,
    name,
    user_created,
    user_owner,
    note,
    proxy_type,
    proxy_host,
    proxy_port,
    proxy_user,
    proxy_password,
    proxy_token,
    created_at,
    expired_at,
    duration,
  } = row;

  const { copy } = useCopyToClipboard();
  const router = useRouter();
  const popover = usePopover();
  const [nameRef, showName] = useTooltipNecessity();
  const [detailRef, showDetail] = useTooltipNecessity();
  const [proxyRef, showProxy] = useTooltipNecessity();
  const [groupRef, showGroup] = useTooltipNecessity();
  const confirm = useBoolean();
  const restore = useBoolean();
  const [loading, setLoading] = useState(false);
  const [displayCopyTooltip, setDisplayCopyTooltip] = useState(false);

  const handleDeleteProfile = async () => {
    try {
      setLoading(true);
      const payload = {
        profile_ids: [id],
      };
      await deleteProfileApi(payload);
      handleReloadData();
      enqueueSnackbar('Xóa hồ sơ thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Xóa hồ sơ thất bại!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
      confirm.onFalse();
    }
  };

  const handleRestoreProfile = async () => {
    try {
      setLoading(true);
      const payload = {
        profile_ids: [id],
      };
      await restoreProfileApi(payload);
      handleReloadData();
      enqueueSnackbar('Khôi phục hồ sơ thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Khôi phục hồ sơ thất bại!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
      restore.onFalse();
    }
  };

  return (
    <TableRow
      hover
      sx={{
        '&:hover .edit-btn': {
          opacity: 1,
        },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            whiteSpace: 'nowrap',
            width: 1,
            transform: 'translateX(20px)',
          }}
        >
          <Typography>{`${profile_hash.slice(0, 5)}***${profile_hash.slice(-5)}`}</Typography>
          <Tooltip
            onClose={() => {
              const timer = setTimeout(() => {
                setDisplayCopyTooltip(false);
                clearTimeout(timer);
              }, 200);
            }}
            title={displayCopyTooltip ? 'Đã sao chép' : 'Sao chép'}
            placement="top"
          >
            <IconButton
              onClick={() => {
                copy(profile_hash);
                setDisplayCopyTooltip(true);
              }}
              sx={{
                p: 0.5,
                borderRadius: 2,
              }}
            >
              <Iconify
                icon="solar:copy-bold-duotone"
                className="edit-btn"
                sx={{
                  opacity: 0,
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {workspace}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          minWidth: 200,
          maxWidth: 300,
        }}
      >
        <Tooltip
          title={showName ? name : ''}
          componentsProps={{
            tooltip: {
              sx: {
                textAlign: 'justify',
                maxWidth: nameRef.current?.offsetWidth || 300,
              },
            },
          }}
        >
          <TextMaxLine ref={nameRef} line={1}>
            {name}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          maxWidth: 300,
        }}
      >
        <Tooltip title={showGroup ? group_name : ''}>
          <TextMaxLine ref={groupRef} line={1}>
            {group_name}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          minWidth: 300,
          maxWidth: 400,
        }}
      >
        <Tooltip
          title={showDetail ? note : ''}
          componentsProps={{
            tooltip: {
              sx: {
                textAlign: 'justify',
                maxWidth: detailRef.current?.offsetWidth || 400,
              },
            },
          }}
        >
          <TextMaxLine ref={detailRef} line={2}>
            {note}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {proxy_type}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
          maxWidth: 300,
        }}
      >
        <Tooltip
          title={
            showProxy
              ? (proxy_type === 'token' && proxy_token) ||
                (proxy_host && `${proxy_host}:${proxy_port}:${proxy_user}:${proxy_password}`)
              : ''
          }
          // componentsProps={{
          //   tooltip: {
          //     sx: {
          //       textAlign: 'justify',
          //       maxWidth: proxyRef.current?.offsetWidth || 400,
          //     },
          //   },
          // }}
        >
          <TextMaxLine ref={proxyRef} display="">
            {(proxy_type === 'token' && proxy_token) ||
              (proxy_host && `${proxy_host}:${proxy_port}:${proxy_user}:${proxy_password}`)}
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
          primary={user_owner?.username || ''}
          secondary={user_owner?.email || ''}
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
        {expired_at && (
          <ListItemText
            primary={format(new Date(expired_at), "d 'tháng' M yyyy")}
            secondary={format(new Date(expired_at), 'p')}
            primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        )}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {deleted_at && (
          <ListItemText
            primary={format(new Date(deleted_at), "d 'tháng' M yyyy")}
            secondary={format(new Date(deleted_at), 'p')}
            primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        )}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
          color: duration > 0 ? 'success.main' : 'error.main',
        }}
      >
        {`${duration} ngày`}
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {isSuperAdmin && (
            <Tooltip title="Chỉnh sửa" placement="top">
              <IconButton onClick={() => router.push(`${paths.dashboard.profile.edit}/${id}`)}>
                <Iconify icon="fluent:edit-16-filled" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="ri:more-2-fill" />
          </IconButton>
        </Stack>
      </TableCell>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'fit-content' }}
      >
        {deleted_at === null && (
          <>
            <MenuItem
              onClick={() => {
                popover.onClose();
                onTransfer(id);
              }}
              disabled={isEmployee}
            >
              <Iconify icon="tabler:transfer" />
              Chuyển hồ sơ
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                popover.onClose();
                confirm.onTrue();
              }}
              sx={{ color: 'error.main' }}
              disabled={!isSuperAdmin}
            >
              <Iconify icon="material-symbols-light:delete" />
              Xóa
            </MenuItem>
          </>
        )}
        {deleted_at !== null && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              restore.onTrue();
            }}
          >
            <Iconify icon="material-symbols:restore-page" />
            Khôi phục
          </MenuItem>
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa hồ sơ?"
        content="Bạn có chắc chắn không? Một khi hồ sơ bị xóa, nó sẽ không thể phục hồi được!"
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="error"
            onClick={handleDeleteProfile}
          >
            Xóa ngay
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={restore.value}
        onClose={restore.onFalse}
        title="Khôi phục hồ sơ?"
        content="Bạn có chắc chắn muốn khôi phục hồ sơ này?"
        action={
          <LoadingButton loading={loading} variant="contained" onClick={handleRestoreProfile}>
            Khôi phục
          </LoadingButton>
        }
      />
    </TableRow>
  );
}

ListProfileTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  isSuperAdmin: PropTypes.bool,
  isEmployee: PropTypes.bool,
  onSelectRow: PropTypes.func,
  handleReloadData: PropTypes.func,
  onTransfer: PropTypes.func,
};
