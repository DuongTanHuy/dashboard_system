import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
// mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// components
import Label, { CustomLabel } from 'src/components/label';
// api
import { NUM_ID_DISPLAY } from 'src/utils/constance';
import { transferProfileApi } from 'src/api/profile.api';
import { formatErrorsV2 } from 'src/utils/format-errors';
import { debounce } from 'lodash';

const TransferMultiProfile = ({ open, onClose, profileIds, handleReloadData }) => {
  const [loading, setLoading] = useState(false);
  const [numItem, setNumItem] = useState(NUM_ID_DISPLAY);
  const [receiver, setReceiver] = useState('');
  const [errors, setErrors] = useState({
    receiver: '',
  });

  const handleTransferProfiles = async () => {
    if (receiver === '') {
      setErrors((prev) => ({ ...prev, receiver: 'Nhập thông tin người nhận' }));
      return;
    }
    try {
      setLoading(true);
      const payload = {
        profile_id: profileIds,
        username: receiver,
      };
      if (profileIds) {
        await transferProfileApi(payload);
        handleReloadData();
        enqueueSnackbar('Chuyển hồ sơ thành công!', { variant: 'success' });
      }
    } catch (error) {
      console.log(error);
      if (error?.error_fields) {
        formatErrorsV2(error?.error_fields, (message) =>
          enqueueSnackbar(message, { variant: 'error' })
        );
      } else {
        enqueueSnackbar(error?.message || 'Chuyển không thành công!', { variant: 'error' });
      }
    } finally {
      setReceiver('');
      handleClose();
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNumItem(NUM_ID_DISPLAY);
    setReceiver('');
    setErrors((prev) => ({ ...prev, receiver: '' }));
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>Chuyển hồ sơ</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body1">Chuyển các hồ sơ có ID:</Typography>
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
                Các hồ sơ bạn chọn đã bị xóa!
              </Typography>
            )}
          </Stack>
          <TextField
            fullWidth
            required
            error={!!errors?.receiver}
            helperText={errors?.receiver}
            focused={!!errors?.receiver}
            label="Nhập tên tài khoản hoặc email người nhận"
            defaultValue={receiver}
            onChange={debounce(
              (event) => {
                setErrors((prev) => ({ ...prev, receiver: '' }));
                setReceiver(event.target.value);
              },
              [500]
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Đóng
        </Button>

        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleTransferProfiles}
          disabled={profileIds.length === 0}
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default TransferMultiProfile;

TransferMultiProfile.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  profileIds: PropTypes.array,
};
