// theme/googleTheme.ts
import { createTheme } from '@mui/material/styles';

export const getGoogleTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4285F4', // ✅ Google Blue
      },
      secondary: {
        main: '#EA4335', // Google Red
      },
      warning: {
        main: '#FBBC05', // Google Yellow
      },
      success: {
        main: '#34A853', // Google Green
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1E1E1E' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#70757a',
        secondary: darkMode ? '#CCCCCC' : '#5f6368',
      },
    },
    typography: {
      fontFamily: `'Lato'`,
      button: {
        fontWeight: 700,
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  });
