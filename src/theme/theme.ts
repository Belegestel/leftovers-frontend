import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#60ad5e',
    },
    secondary: {
      main: '#555555',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
    },
    divider: '#aaaaaa',
    error: {
      main: '#ff5555',
    },
    rating: {
      main: '#fdd835',
    },
    privateOverlay: {
      main: 'rgba(0, 0, 0, 0.65)',
    },
    notification: {
      main: '#ff5555'
    }
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 4,
  },

  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#ffffff',
            color: '#60ad5e',
            boxShadow: 'none',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});
