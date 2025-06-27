import { Button, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { bgGradient } from 'src/theme/css';

const CmsUserTableToolBar = () => {
  const theme = useTheme();
  const { user } = useAuthContext();

  return (
    <Stack
      direction="row"
      sx={{
        p: 2.5,
        mb: 5,
      }}
      position="relative"
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          position: 'absolute',
          top: -10,
        }}
      >
        <Stack
          component={Button}
          sx={{
            ...bgGradient({
              direction: 'to top',
              startColor: alpha(theme.palette.primary.light, 0.6),
              endColor: alpha(theme.palette.primary.main, 0.6),
            }),
            borderRadius: 1,
            p: 2.5,
            boxShadow: theme.customShadows.z4,
          }}
        >
          <Iconify icon="dashicons:admin-users" width={30} color="white" />
        </Stack>
        <Stack
          sx={{
            position: 'relative',
            bottom: -12,
          }}
        >
          <Typography variant="h6">
            {user?.role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </Typography>
          <Typography color="text.secondary">{`${user?.username} / ${user?.email}`}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CmsUserTableToolBar;
