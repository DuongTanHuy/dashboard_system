import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { formatErrors } from 'src/utils/format-errors';
import { Divider, Typography } from '@mui/material';
import { ERROR_CODE } from 'src/utils/constance';
import { changePasswordApi } from 'src/api/auth.api';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const oldPassword = useBoolean();
  const newPassword = useBoolean();
  const rePassword = useBoolean();

  const passwordSchema = Yup.object().shape({
    old_password: Yup.string().required('Vui lòng nhập mật khẩu cũ!'),
    new_password: Yup.string()
      .required('Vui lòng nhập mật khẩu!')
      .min(12, 'Mật khẩu phải có ít nhất 12 ký tự!')
      .matches(/(?=.*?[A-Z])/, 'Mật khẩu phải có ít nhất một chữ cái viết hoa!')
      .matches(/(?=.*?[a-z])/, 'Mật khẩu phải có ít nhất một chữ cái viết thường!')
      .matches(/(?=.*?[0-9])/, 'Mật khẩu phải có ít nhất một chữ số!')
      .matches(/(?=.*?[#?!@$%^&*-])/, 'Mât khẩu phải có ít nhất một ký tự đặc biệt!')
      .notOneOf([Yup.ref('old_password')], 'Mật khẩu mới không được trùng với mật khẩu cũ!'),
    re_password: Yup.string()
      .required('Vui lòng nhập lại mật khẩu!')
      .oneOf([Yup.ref('new_password'), null], 'Mật khẩu không khớp!'),
  });

  const defaultValues = {
    old_password: '',
    new_password: '',
    re_password: '',
  };

  const methods = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { old_password, new_password } = data;
      const payload = {
        old_password,
        new_password,
      };
      await changePasswordApi(payload);
      reset();
      enqueueSnackbar('Thay đổi mật khẩu thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.INCORRECT_OLD_PASS) {
        setError('old_password', {
          type: 'manual',
          message: 'Mật khẩu cũ không chính xác!',
        });
      } else if (error?.error_fields) {
        formatErrors(error.error_fields, setError);
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1} mb={2}>
          <Typography variant="h6">Thay đổi mật khẩu</Typography>
          <Divider />
        </Stack>
        <RHFTextField
          name="old_password"
          type={oldPassword.value ? 'text' : 'password'}
          label="Nhập mật khẩu cũ"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={oldPassword.onToggle} edge="end">
                  <Iconify icon={oldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="new_password"
          label="Nhập mật khẩu mới"
          type={newPassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={newPassword.onToggle} edge="end">
                  <Iconify icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Vui lòng nhập đúng định
              dạng mật khẩu
            </Stack>
          }
        />

        <RHFTextField
          name="re_password"
          type={rePassword.value ? 'text' : 'password'}
          label="Nhập lại mật khẩu mới"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={rePassword.onToggle} edge="end">
                  <Iconify icon={rePassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Lưu thay đổi
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
