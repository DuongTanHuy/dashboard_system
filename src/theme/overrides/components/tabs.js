export function tabs(theme) {
  const isLightMode = theme.palette.mode === 'light';
  return {
    MuiTabs: {
      // styleOverrides: {
      //   indicator: {
      //     backgroundColor: theme.palette.text.primary,
      //   },
      //   scrollButtons: {
      //     width: 48,
      //     borderRadius: '50%',
      //   },
      // },
      styleOverrides: {
        root: {
          position: 'relative',
          backgroundColor: theme.palette.grey[isLightMode ? 100 : 900],
          borderRadius: '0.75rem',
          minHeight: 'unset',
          padding: '0.25rem',
          '& .MuiTabs-scroller': {
            overflow: 'unset !important',
          },
        },

        flexContainer: {
          height: '100%',
          position: 'relative',
          zIndex: 10,
        },

        fixed: {
          overflow: 'unset !important',
          overflowX: 'unset !important',
        },

        vertical: {
          '& .MuiTabs-indicator': {
            width: '100%',
          },
        },

        indicator: {
          height: '100%',
          borderRadius: '0.5rem',
          backgroundColor: theme.palette.grey[isLightMode ? 0 : 700],
          boxShadow: theme.customShadows.z24,
          transition: 'all 500ms ease',
        },
      },
    },
    MuiTab: {
      // styleOverrides: {
      //   root: {
      //     padding: 0,
      //     opacity: 1,
      //     minWidth: 48,
      //     minHeight: 48,
      //     fontWeight: theme.typography.fontWeightSemiBold,
      //     '&:not(:last-of-type)': {
      //       marginRight: theme.spacing(3),
      //       [theme.breakpoints.up('sm')]: {
      //         marginRight: theme.spacing(5),
      //       },
      //     },
      //     [`&:not(.${tabClasses.selected})`]: {
      //       color: theme.palette.text.secondary,
      //     },
      //   },
      // },
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          flex: '1 1 auto',
          textAlign: 'center',
          maxWidth: 'unset !important',
          minWidth: 'unset !important',
          minHeight: 'unset !important',
          fontSize: '1rem',
          fontWeight: 400,
          textTransform: 'none',
          lineHeight: 'inherit',
          padding: '0.25rem',
          borderRadius: '0.5rem',
          color: `${theme.palette.text.primary} !important`,
          opacity: '1 !important',

          '& .material-icons, .material-icons-round': {
            marginBottom: '0 !important',
            marginRight: '0.375rem',
          },

          '& svg': {
            marginBottom: '0 !important',
            marginRight: '0.375rem',
          },

          '& i.MuiTab-iconWrapper': {
            marginBottom: 0,
          },
        },

        labelIcon: {
          paddingTop: '0.25rem',
        },
      },
    },
  };
}
