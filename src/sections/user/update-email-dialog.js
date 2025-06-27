import React, { useEffect, useState } from 'react';
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
import { useUpdateUserEmail } from 'src/tanstack/use-user';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function UpdateEmailDialog({ open, emailInfo, onClose, userId, setEmailData }) {
  const [email, setEmail] = useState(emailInfo);
  const [errorValidate, setErrorValidate] = useState('');
  const [errorMsg, setErrorMsh] = useState('');

  const { mutate, isPending } = useUpdateUserEmail();

  const handleAdd = async () => {
    if (!email) {
      setErrorValidate('Vui lòng nhập địa chỉ email!');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorValidate('Địa chỉ email không hợp lệ!');
      return;
    }

    const payload = {
      email,
    };
    mutate(
      {
        userId,
        payload,
      },
      {
        onSuccess: () => {
          setEmailData(email);
          enqueueSnackbar('Chỉnh sửa email thành công!', { variant: 'success' });
          handleClose();
        },
        onError: (error) => {
          if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
            handleClose();
            enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
          } else if (error?.error_fields) {
            setErrorMsh('Email này đã được sử dụng!');
          } else {
            setErrorMsh('Chỉnh sửa email thất bại!');
          }
        },
      }
    );
  };

  const handleClose = () => {
    setEmail('');
    setErrorValidate('');
    setErrorMsh('');
    onClose();
  };

  useEffect(() => {
    if (open) {
      setEmail(emailInfo);
    }
  }, [emailInfo, open]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Stack spacing={2} p={3} pb={0}>
        <Typography variant="h6">Chỉnh sửa email</Typography>
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
          label="Email"
          placeholder="Nhập địa chỉ email"
          error={!!errorValidate}
          helperText={errorValidate}
          value={email}
          onChange={(event) => {
            if (errorMsg) {
              setErrorMsh('');
            }
            if (errorValidate) {
              setErrorValidate('');
            }
            setEmail(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Đóng
        </Button>
        <LoadingButton
          loading={isPending}
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={emailInfo === email}
        >
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

UpdateEmailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setEmailData: PropTypes.func,
  userId: PropTypes.number,
  emailInfo: PropTypes.string,
};
