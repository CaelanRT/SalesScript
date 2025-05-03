import { createTheme } from '@mui/material/styles';

// New color palette:
// Dark gray/slate: #393E41
// Light gray/taupe: #D3D0CB
// Light beige: #E7E5DF
// Teal: #44BBA4
// Gold/yellow: #E7B841

const theme = createTheme({
  palette: {
    primary: {
      main: '#44BBA4', // Teal as primary
      light: '#6BCEBB',
      dark: '#339985',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E7B841', // Gold as secondary
      light: '#F2CA6E',
      dark: '#D19F2A',
      contrastText: '#393E41',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#E7B841', // Gold for warnings
    },
    info: {
      main: '#44BBA4', // Teal for info
    },
    success: {
      main: '#4CAF50',
    },
    text: {
      primary: '#393E41', // Dark gray for text
      secondary: '#6B6E70', // Lighter variant for secondary text
    },
    background: {
      default: '#E7E5DF', // Light beige as background
      paper: '#FFFFFF',
    },
    divider: '#D3D0CB', // Light gray for dividers
    grey: {
      50: '#F8F8F6',
      100: '#E7E5DF', // Light beige
      200: '#D3D0CB', // Light gray/taupe
      300: '#C0BDB8',
      400: '#A9A6A1',
      500: '#8E8B86',
      600: '#6B6E70',
      700: '#555759',
      800: '#393E41', // Dark gray/slate
      900: '#2A2D2F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#393E41',
    },
    h5: {
      fontWeight: 500,
      marginBottom: '0.75rem',
      color: '#393E41',
    },
    h6: {
      fontWeight: 500,
      color: '#393E41',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#393E41',
    },
    body2: {
      color: '#6B6E70',
    },
    button: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(57, 62, 65, 0.08)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(57, 62, 65, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#D3D0CB',
            },
            '&:hover fieldset': {
              borderColor: '#44BBA4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#44BBA4',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(57, 62, 65, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #44BBA4 0%, #339985 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #E7B841 0%, #D19F2A 100%)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(57, 62, 65, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#D3D0CB',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#44BBA4',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
