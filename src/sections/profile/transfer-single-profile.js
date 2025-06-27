import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
// mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
// components
import { formatErrorsV2 } from 'src/utils/format-errors';
import { transferProfileApi } from 'src/api/profile.api';

const TransferSingleProfile = ({ open, onClose, id, handleReloadData }) => {
  const [receiver, setReceiver] = useState('');
  const [errors, setErrors] = useState({
    receiver: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSendProfile = async () => {
    if (receiver === '') {
      setErrors((prev) => ({ ...prev, receiver: 'Nhập thông tin người nhận' }));
      return;
    }
    try {
      setLoading(true);
      const payload = {
        profile_id: [id],
        username: receiver,
      };
      if (id) {
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
      onClose();
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => {
        setReceiver('');
        setErrors((prev) => ({ ...prev, receiver: '' }));
        onClose();
      }}
    >
      <DialogTitle>Chuyển hồ sơ</DialogTitle>
      <DialogContent
        sx={{
          pt: '4px!important',
        }}
      >
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            setReceiver('');
            setErrors((prev) => ({ ...prev, receiver: '' }));
            onClose();
          }}
        >
          Đóng
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleSendProfile}
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default TransferSingleProfile;

TransferSingleProfile.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  id: PropTypes.number,
};
