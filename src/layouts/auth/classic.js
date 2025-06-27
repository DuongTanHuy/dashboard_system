import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
//
import { HeaderSimple as Header } from '../_common';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ title, children, sx }) {
  return (
    <>
      <Header />

      <Box
        component="main"
        sx={{
          py: 12,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          textAlign: 'center',
          px: { xs: 2, md: 0 },
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          '&:before': {
            width: 1,
            height: 1,
            zIndex: -1,
            content: "''",
            opacity: 0.9,
            position: 'absolute',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: 'url(/assets/background/background.svg)',
          },
        }}
      >
        {title}
        <Card
          sx={{
            py: 5,
            px: 3,
            width: 1,
            maxWidth: 420,
            boxShadow: (theme) => theme.customShadows.z8,
            ...sx,
          }}
        >
          {children}
        </Card>
      </Box>
    </>
  );
}

AuthClassicLayout.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
};
