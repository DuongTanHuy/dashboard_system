import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import { useUpdateUserReferer } from 'src/tanstack/use-user';

export default function UpdateRefererDialog({ open, onClose, setRefererData, userId, mode }) {
  const [referer, setReferer] = useState('');
  const [errorValidate, setErrorValidate] = useState('');
  const [errorMsg, setErrorMsh] = useState('');

  const { mutate, isPending } = useUpdateUserReferer();

  const handleAdd = async () => {
    if (!referer) {
      setErrorValidate('Vui lòng nhập người giới thiệu');
      return;
    }

    const payload = {
      username: referer,
    };

    mutate(
      {
        userId,
        payload,
      },
      {
        onSuccess: (response) => {
          setRefererData({
            username: response?.username,
            email: response?.email,
          });
          enqueueSnackbar('Thêm người giới thiệu thành công!', { variant: 'success' });
          handleClose();
        },
        onError: (error) => {
          if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
            handleClose();
            enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
          } else {
            setErrorMsh('Thêm người giới thiệu thất bại!');
          }
        },
      }
    );
  };

  const handleClose = () => {
    setReferer('');
    setErrorValidate('');
    setErrorMsh('');
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Stack spacing={2} p={3} pb={0}>
        <Typography variant="h6">{`${
          mode === 'add' ? 'Thêm' : 'Cập nhật'
        } người giới thiệu`}</Typography>
        <Divider />
      </Stack>
      <DialogContent
        sx={{
          pt: 2,
        }}
      >
        {!!errorMsg && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {errorMsg}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Người giới thiệu"
          placeholder="Nhập tên tài khoản hoặc email người giới thiệu"
          error={!!errorValidate}
          helperText={errorValidate}
          value={referer}
          onChange={(event) => {
            if (errorMsg) {
              setErrorMsh('');
            }
            if (errorValidate) {
              setErrorValidate('');
            }
            setReferer(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Đóng
        </Button>
        <LoadingButton loading={isPending} variant="contained" color="primary" onClick={handleAdd}>
          {mode === 'add' ? 'Thêm' : 'Cập nhật'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

UpdateRefererDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setRefererData: PropTypes.func,
  userId: PropTypes.number,
  mode: PropTypes.string,
};
