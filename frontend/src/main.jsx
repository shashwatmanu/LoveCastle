import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';  
import { SnackbarProvider } from 'notistack'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
    <App />
    </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
)
