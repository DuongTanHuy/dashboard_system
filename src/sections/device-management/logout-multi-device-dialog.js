import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
// mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import Label, { CustomLabel } from 'src/components/label';
// api
import { ERROR_CODE, NUM_ID_DISPLAY } from 'src/utils/constance';
import { logoutDeviceApi } from 'src/api/device.api';

const LogoutMultiDeviceDialog = ({ open, onClose, deviceIds, handleReloadData }) => {
  const [loading, setLoading] = useState(false);
  const [numItem, setNumItem] = useState(NUM_ID_DISPLAY);

  const handleLogoutDevice = async () => {
    try {
      setLoading(true);
      const payload = {
        device_ids: deviceIds,
      };
      await logoutDeviceApi(payload);
      handleReloadData();
      enqueueSnackbar('Đăng xuất thiết bị thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Đăng xuất thiết bị thất bại!', { variant: 'error' });
      }
    } finally {
      onClose();
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNumItem(NUM_ID_DISPLAY);
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Bạn có chắc chắn không?"
      content={
        <Stack spacing={3}>
          <Typography variant="body1">Đăng xuất các thiết bị có ID sau:</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {deviceIds.slice(0, numItem).map((profileId) => (
              <Label
                key={profileId}
                color="primary"
                sx={{
                  p: 2,
                }}
              >
                {profileId}
              </Label>
            ))}
            {deviceIds.length > NUM_ID_DISPLAY && (
              <CustomLabel length={deviceIds.length} numItem={numItem} setNumItem={setNumItem} />
            )}
          </Stack>
        </Stack>
      }
      action={
        <LoadingButton
          loading={loading}
          variant="contained"
          color="error"
          onClick={handleLogoutDevice}
          disabled={deviceIds.length === 0}
        >
          Đăng xuất
        </LoadingButton>
      }
    />
  );
};

export default LogoutMultiDeviceDialog;

LogoutMultiDeviceDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  deviceIds: PropTypes.array,
};
