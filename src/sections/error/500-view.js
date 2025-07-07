import { m } from 'framer-motion';

// @mui
import Typography from '@mui/material/Typography';
// assets
import { SeverErrorIllustration } from 'src/assets/illustrations';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
import { Container, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <Container component="main">
      <Stack
        sx={{
          m: 'auto',
          maxWidth: 600,
          height: '100vh',
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                family: 'Roboto',
                fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
              }}
            >
              500 Internal Server Error
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography
              sx={{
                color: 'text.secondary',
                family: 'Roboto',
                fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
              }}
            >
              There was an error, please try again later.
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>
        </MotionContainer>
      </Stack>
    </Container>
  );
}
