import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
// assets
import { useAuthContext } from 'src/auth/hooks';
import { getStorage } from 'src/hooks/use-local-storage';
import { useState } from 'react';
import { Alert, Divider, alpha } from '@mui/material';
import { useTheme } from '@emotion/react';
import { bgGradient } from 'src/theme/css';
import { ERROR_CODE, TICKET } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtOtpView() {
  const { loginOtp } = useAuthContext();
  const theme = useTheme();
  const ticket = getStorage(TICKET);
  const [errorMsg, setErrorMsg] = useState('');

  const VerifySchema = Yup.object().shape({
    code: Yup.string().required('Vui lòng nhập OTP'),
  });

  const defaultValues = {
    code: '123456',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { code } = data;
      const payload = {
        code,
        ticket: JSON.parse(ticket),
      };
      console.log(payload);

      // api not available
      await loginOtp?.(payload);
    } catch (error) {
      reset();
      setErrorMsg(error?.response?.data?.message || 'Something went wrong');
    }
  });

  const handleResendOtp = async () => {
    try {
      const payload = {
        ticket: JSON.parse(ticket),
      };
      console.log(payload);
      // api not available
      // await reSendOtpApi(payload);
      enqueueSnackbar('Gửi thành công!', {
        variant: 'success',
      });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.RATE_LIMIT) {
        enqueueSnackbar('Số lượng yêu cầu quá nhiều, thử lại sau 1 phút!', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Ticket không chính xác!', {
          variant: 'error',
        });
      }
    }
  };

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
        <Iconify icon="material-symbols:navigate-next" />
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          // component={RouterLink}
          // href="#"
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleResendOtp}
        >
          Resend code
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href="/"
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <Stack
      spacing={1}
      sx={{
        ...bgGradient({
          direction: 'to top',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.light, 0.3),
        }),
        boxShadow: theme.customShadows.z8,
        borderRadius: 1,
        py: 3,
        px: 2,
        position: 'relative',
        top: -66,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4">Please check your email!</Typography>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        We have sent a confirmation code to your email, please enter the code in the box below to
        verify your email.
      </Typography>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      <Divider
        sx={{
          position: 'relative',
          top: -36,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, .4), transparent)',
          backgroundColor: 'transparent',
          borderTop: 'none',
          height: '1px',
          border: 0,
        }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {renderForm}
    </FormProvider>
  );
}
