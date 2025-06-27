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
import { deleteProfileApi } from 'src/api/profile.api';

const DeleteMultiDialog = ({ open, onClose, profileIds, handleReloadData }) => {
  const [loading, setLoading] = useState(false);
  const [numItem, setNumItem] = useState(NUM_ID_DISPLAY);

  const handleDeleteProfiles = async () => {
    try {
      setLoading(true);
      const payload = {
        profile_ids: profileIds,
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
          <Typography variant="body1">Các hồ sơ có ID sẽ bị xóa:</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {profileIds.length > 0 ? (
              <>
                {profileIds.slice(0, numItem).map((profileId) => (
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
                {profileIds.length > NUM_ID_DISPLAY && (
                  <CustomLabel
                    length={profileIds.length}
                    numItem={numItem}
                    setNumItem={setNumItem}
                  />
                )}
              </>
            ) : (
              <Typography color="error.main" variant="subtitle2">
                Các hồ sơ đã chọn đã bị xóa!
              </Typography>
            )}
          </Stack>
        </Stack>
      }
      action={
        <LoadingButton
          loading={loading}
          variant="contained"
          color="error"
          onClick={handleDeleteProfiles}
          disabled={profileIds.length === 0}
        >
          Xóa ngay
        </LoadingButton>
      }
    />
  );
};

export default DeleteMultiDialog;

DeleteMultiDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  profileIds: PropTypes.array,
};
