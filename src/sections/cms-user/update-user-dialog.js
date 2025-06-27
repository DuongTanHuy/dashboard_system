import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { Box, Button, Dialog, Divider, MenuItem, Stack, Typography } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import { formatErrors } from 'src/utils/format-errors';
import { useUpdateCmsUse } from 'src/tanstack/use-cms-user';

// ----------------------------------------------------------------------

export const ROLE_OPTIONS = [
  { id: 'rp_01', value: 'employee', label: 'Employee' },
  { id: 'rp_02', value: 'approver', label: 'Approver' },
  { id: 'rp_03', value: 'admin', label: 'Admin' },
  { id: 'rp_04', value: 'super_admin', label: 'Super Admin' },
];

// ----------------------------------------------------------------------

const UpdateUserDialog = ({ open, onClose, userInfo, handleReloadData }) => {
  const userSchema = Yup.object().shape({
    first_name: Yup.string().required('Vui lòng nhập tên'),
    last_name: Yup.string().required('Vui lòng nhập họ'),
    username: Yup.string().required('Vui lòng nhập tên tài khoản'),
    phone: Yup.string()
      .matches(/^(?:(03|05|07|08|09|84)+([0-9]{8})\b)?$/, 'Số điện thoại không hợp lệ')
      .notRequired(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: userInfo?.first_name || '',
      last_name: userInfo?.last_name || '',
      username: userInfo?.username || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      role: userInfo?.role || '',
    }),
    [
      userInfo?.email,
      userInfo?.first_name,
      userInfo?.last_name,
      userInfo?.phone,
      userInfo?.role,
      userInfo?.username,
    ]
  );

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isDirty },
  } = methods;

  const { mutate, isPending } = useUpdateCmsUse();

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        userId: userInfo?.id,
        data,
      },
      {
        onSuccess: () => {
          enqueueSnackbar('Cập nhật thông tin thành công!', { variant: 'success' });
          handleClose();
        },
        onError: (error) => {
          if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
            enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
            handleClose();
          } else if (error?.error_fields) {
            formatErrors(error.error_fields, setError);
          } else {
            enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
            handleClose();
          }
        },
      }
    );
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (userInfo) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, userInfo]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">Cập nhật thông tin tài khoản</Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          sx={{
            p: 3,
            pt: 0,
          }}
        >
          <RHFTextField name="last_name" label="Họ" placeholder="Vui lòng nhập họ" />
          <RHFTextField name="first_name" label="Tên" placeholder="Vui lòng nhập tên" />
          <RHFTextField
            name="username"
            label="Tên tài khoản"
            placeholder="Vui lòng nhập tên tài khoản"
          />
          <RHFTextField
            name="email"
            label="Địa chỉ email"
            placeholder="Vui lòng nhập địa chỉ email"
          />
          <RHFTextField
            name="phone"
            label="Số điện thoại"
            placeholder="Vui lòng nhập số điện thoại"
          />

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
        </Box>
        <Stack direction="row" spacing={2} justifyContent="end" p={3} pt={0}>
          <Button onClick={handleClose} variant="outlined">
            Đóng
          </Button>
          <LoadingButton
            loading={isPending}
            disabled={!isDirty}
            type="submit"
            color="primary"
            variant="contained"
          >
            Cập nhật
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateUserDialog;

UpdateUserDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  userInfo: PropTypes.object,
  handleReloadData: PropTypes.func,
};
