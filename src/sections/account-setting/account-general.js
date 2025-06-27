import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// components
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { Divider } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string().required('Vui lòng nhập tên tài khoản'),
    email: Yup.string()
      .required('Vui lòng nhập địa chỉ email')
      .email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable(),
    firstName: Yup.string().required('Vui lòng nhập tên của bạn'),
    lastName: Yup.string().required('Vui lòng nhập họ của bạn'),
  });

  const defaultValues = {
    username: user?.username || '',
    email: user?.email || '',
    photoURL: '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 3, pb: 5, px: 3, textAlign: 'center', height: 1 }}>
            <Stack spacing={1} mb={2}>
              <Typography variant="h6">Avatar</Typography>
              <Divider />
            </Stack>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, height: 1 }}>
            <Stack spacing={1} mb={6}>
              <Typography variant="h6">Thông tin cá nhân</Typography>
              <Divider />
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" disabled />
              <RHFTextField name="email" label="Email" disabled />
              <RHFTextField name="lastName" label="Last name" />
              <RHFTextField name="firstName" label="First name" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save change
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
