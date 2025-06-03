import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3840DE', // WeTransfer blue
      light: '#5B62E9',
      dark: '#2A31B3',
    },
    secondary: {
      main: '#000000', // Black
      light: '#333333',
      dark: '#000000',
    },
    background: {
      default: '#FFFFFF', // Clean white background
      paper: '#FFFFFF', // White for cards and surfaces
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#666666', // Medium gray for secondary text
    },
    error: {
      main: '#FF3366', // Soft red for errors
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"GT Walsheim Pro", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 500,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 500,
      letterSpacing: '-0.25px',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: 0,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: 0,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: 0,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: 0,
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: 0,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: 0,
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 100, // Rounded buttons like WeTransfer
          fontWeight: 500,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(56, 64, 222, 0.04)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'wetransfer' },
          style: {
            backgroundColor: '#3840DE',
            color: '#FFFFFF',
            borderRadius: 100,
            padding: '12px 32px',
            '&:hover': {
              backgroundColor: '#5B62E9',
              transform: 'translateY(-2px)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.3s ease',
          border: '1px solid #F5F5F5',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E0E0E0',
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: '#BDBDBD',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3840DE',
              borderWidth: '1px',
            },
            '& input': {
              padding: '14px 16px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#757575',
            fontSize: '0.9rem',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3840DE',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid #F5F5F5',
          color: '#000000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #F5F5F5',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F5',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(56, 64, 222, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(56, 64, 222, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: '#757575',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3840DE',
        },
      },
    },
  },
});

export default theme;
