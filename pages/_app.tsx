import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b99040',
      contrastText: '#FFFFFF',
      dark: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: { fontWeight: 'bold' },
        outlined: {
          fontWeight: 'bold',
          fontSize: 20,
          borderWidth: 2,
          backgroundColor: 'rgba(255,255,255, 0.8)',
          ':hover': {
            backgroundColor: 'rgba(255,255,255, 1)',
            borderWidth: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        multiline: {
          backgroundColor: 'white',
          minHeight: 150,
          paddingRight: 14,
        },
        root: {
          height: 50,
          overflow: 'hidden',
          paddingRight: 0,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
