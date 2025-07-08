import { createTheme } from '@mui/material/styles';

// Color palette that works for both light and dark modes
const colors = {
  primary: {
    main: '#3a7bd5',
    light: '#5a9cff',
    dark: '#0058a2',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#00bcd4',
    light: '#62efff',
    dark: '#008ba3',
    contrastText: '#ffffff',
  },
  success: {
    main: '#43a047',
    light: '#76d275',
    dark: '#00701a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffc947',
    dark: '#c66900',
    contrastText: '#000000',
  },
  info: {
    main: '#03a9f4',
    light: '#67daff',
    dark: '#007ac1',
    contrastText: '#ffffff',
  }
};

// Custom shadows for light mode
const lightShadows = [
  'none',
  '0px 2px 8px rgba(0, 0, 0, 0.05)',
  '0px 4px 16px rgba(0, 0, 0, 0.08)',
  '0px 6px 24px rgba(0, 0, 0, 0.12)',
  '0px 8px 32px rgba(0, 0, 0, 0.16)',
  '0px 10px 40px rgba(0, 0, 0, 0.2)',
  '0px 12px 48px rgba(0, 0, 0, 0.24)',
  '0px 14px 56px rgba(0, 0, 0, 0.28)',
  '0px 16px 64px rgba(0, 0, 0, 0.32)',
  '0px 18px 72px rgba(0, 0, 0, 0.36)',
  '0px 20px 80px rgba(0, 0, 0, 0.4)',
  '0px 22px 88px rgba(0, 0, 0, 0.44)',
  '0px 24px 96px rgba(0, 0, 0, 0.48)',
];

// Custom shadows for dark mode (more subtle)
const darkShadows = [
  'none',
  '0px 2px 8px rgba(0, 0, 0, 0.25)',
  '0px 4px 16px rgba(0, 0, 0, 0.35)',
  '0px 6px 24px rgba(0, 0, 0, 0.45)',
  '0px 8px 32px rgba(0, 0, 0, 0.55)',
  '0px 10px 40px rgba(0, 0, 0, 0.65)',
  '0px 12px 48px rgba(0, 0, 0, 0.75)',
  '0px 14px 56px rgba(0, 0, 0, 0.8)',
  '0px 16px 64px rgba(0, 0, 0, 0.85)',
  '0px 18px 72px rgba(0, 0, 0, 0.9)',
  '0px 20px 80px rgba(0, 0, 0, 0.95)',
  '0px 22px 88px rgba(0, 0, 0, 0.97)',
  '0px 24px 96px rgba(0, 0, 0, 1)',
];

// Light mode theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#5f6368',
    },
    ...colors,
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: lightShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          backgroundImage: `linear-gradient(90deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${colors.primary.light}`,
        },
      },
    },
  },
});

// Dark mode theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#aaaaaa',
    },
    ...colors,
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: darkShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundImage: 'none',
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(8px)',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
        },
        elevation2: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.7)',
            border: `1px solid ${colors.primary.dark}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)',
          backgroundImage: `linear-gradient(90deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${colors.primary.dark}`,
        },
      },
    },
  },
});

export default lightTheme; 