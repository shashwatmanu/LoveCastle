import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f5af19', 
    },
    secondary: {
      main: '#f12711', 
    },
    error: {
      main: '#6A1E55', 
    },
    warning: {
      main: '#f5af19', // Highlight
    },
    background: {
      default: '#1A1A1D', // Default background
      paper: '#3B1C32', // Cards or elevated surfaces
    },
    text: {
      primary: '#FFFFFF', // Text on dark backgrounds
      secondary: '#f12711', // Subtle text
    },
  },
  customGradients: {
    primary: 'linear-gradient(0deg, #f12711, #f5af19)',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontFamily: 'Poltawski Nowy, sans-serif', fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    button: { textTransform: 'none' },
  },
});

export default theme;
