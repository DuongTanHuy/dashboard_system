import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import Iconify from 'src/components/iconify';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { formatErrors } from 'src/utils/format-errors';
import { useCreateCmsUse } from 'src/tanstack/use-cms-user';
import { ROLE_OPTIONS } from './update-user-dialog';

const CreateUserDialog = ({ open, onClose }) => {
  const { copy } = useCopyToClipboard();
  const [password, setPassword] = useState('');
  const [displayCopyTooltip, setDisplayCopyTooltip] = useState(false);

  const userSchema = Yup.object().shape({
    username: Yup.string().required('Vui lòng nhập tên tài khoản'),
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  });

  const defaultValues = {
    username: '',
    email: '',
    role: 'employee',
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setError } = methods;

  const { mutate, isPending } = useCreateCmsUse();

  const onSubmit = handleSubmit((data) => {
    const { username, email, role } = data;
    const payload = {
      username,
      email,
      role,
    };

    // const response = await createCmsUserApi(payload);
    // setPassword(response?.data?.data?.password);
    mutate(payload, {
      onSuccess: (response) => {
        setPassword(response);
        enqueueSnackbar('Tạo tài khoản thành công!', { variant: 'success' });
      },
      onError: (error) => {
        if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
          enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
          handleClose();
        } else if (error?.error_fields) {
          formatErrors(error.error_fields, setError);
        } else {
          enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
        }
      },
    });
  });

  const handleClose = () => {
    onClose();
    reset();
    setPassword('');
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">
          {password ? 'Tạo tài khoản thành công' : 'Tạo tài khoản'}
        </Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2} p={3} pt={0}>
          {!password && (
            <>
              <RHFTextField
                name="username"
                label="Tên tài khoản"
                placeholder="Vui lòng nhập tên tài khoản"
              />
              <RHFTextField name="email" label="Email" placeholder="Vui lòng nhập email" />
              <RHFSelect
                fullWidth
                name="role"
                label="Vai trò"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </>
          )}
          {password && (
            <TextField
              label="Your password"
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      onClose={() => setDisplayCopyTooltip(false)}
                      open={displayCopyTooltip}
                      title="Copied"
                      placement="top"
                    >
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setDisplayCopyTooltip(true);
                          copy(password);
                        }}
                      >
                        <Iconify icon="solar:copy-bold-duotone" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Stack direction="row" spacing={2} justifyContent="end">
            <Button onClick={handleClose} variant="outlined">
              Đóng
            </Button>
            {!password && (
              <LoadingButton loading={isPending} type="submit" color="primary" variant="contained">
                Tạo mới
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default CreateUserDialog;

CreateUserDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
