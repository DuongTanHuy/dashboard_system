import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { useSearchParams, useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Divider, alpha } from '@mui/material';
import { useTheme } from '@emotion/react';
import { bgGradient } from 'src/theme/css';
import { paths } from 'src/routes/paths';
import { PASSWORD, USER } from 'src/utils/constance';

// ----------------------------------------------------------------------

export const auth_account = ['huy1005.dev@gmail.com', 'admin@gmail.com'];

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const passwordShow = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Vui lòng nhập tên đăng nhập hoặc email'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const defaultValues = {
    username: 'huy1005.dev@gmail.com',
    password: 'User123456@',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { username, password } = data;

      // api no available
      // await login({ username, password });

      if (auth_account.includes(username) && password === 'User123456@') {
        localStorage.setItem(USER, JSON.stringify(username));
        localStorage.setItem(PASSWORD, JSON.stringify(password));
      } else {
        throw new Error('Invalid username or password');
      }
      router.push(`${paths.auth.jwt.verify_otp}${returnTo ? `?returnTo=${returnTo}` : ''}`);
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.message || 'Something went wrong');
    }
  });

  const renderHead = (
    <Stack
      spacing={2}
      sx={{
        ...bgGradient({
          direction: 'to top',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.light, 0.3),
        }),
        boxShadow: theme.customShadows.z8,
        borderRadius: 1,
        py: 3,
        position: 'relative',
        top: -46,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4" color="text.primary">
        Welcome back!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Enter your email and password to sign in
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="username" label="Username or email" variant="standard" />

      <Stack spacing={1.5}>
        <RHFTextField
          name="password"
          label="Password"
          type={passwordShow.value ? 'text' : 'password'}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        SIGN IN
        <Iconify icon="material-symbols:navigate-next" />
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 3,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      <Divider
        sx={{
          position: 'relative',
          top: -20,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, .4), transparent)',
          backgroundColor: 'transparent',
          borderTop: 'none',
          height: '1px',
          border: 0,
        }}
      />

      <Alert
        severity="info"
        sx={{
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            display: 'block',
            width: 'fit-content',
          }}
        >
          Admin:{' '}
          <Typography component="span" variant="caption">
            admin@gmail.com
          </Typography>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            display: 'block',
            width: 'fit-content',
          }}
        >
          Password:{' '}
          <Typography component="span" variant="caption">
            User123456@
          </Typography>
        </Typography>
      </Alert>

      {renderForm}

      {renderTerms}
    </FormProvider>
  );
}
