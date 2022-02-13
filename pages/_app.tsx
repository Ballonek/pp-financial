import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styles from '../styles/Home.module.css';
import MailIcon from '@mui/icons-material/Mail';

const client = new QueryClient();

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

const drawerWidth = 240;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { pathname } = router;

  const isAdmin = useMemo(() => {
    if (pathname === '/') {
      return false;
    }
    const paths = pathname.split('/');

    if (paths[paths.length - 1] === 'admin') {
      return false;
    }

    if (paths.includes('admin')) {
      return true;
    }

    return false;
  }, [pathname]);

  useEffect(() => {
    const handleStart = (url: string) => (url !== router.pathname ? setLoading(true) : setLoading(false));

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        {loading && (
          <div
            style={{
              backgroundColor: 'rgba(255,255,255, 0.6)',
              width: '100%',
              height: '100vh',
              position: 'absolute',
              zIndex: 100000,
              left: 0,
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </div>
        )}
        {isAdmin ? (
          <>
            <AppBar position='fixed' sx={{ width: `100%`, zIndex: 10 }}>
              <Toolbar>
                <Typography variant='h6' noWrap component='div'>
                  Admin
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', zIndex: 1 }}>
              <CssBaseline />
              <Drawer
                sx={{
                  zIndex: 0,
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                  },
                }}
                variant='permanent'
                anchor='left'
              >
                <Toolbar />
                <Divider />
                <List>
                  <ListItem button onClick={() => router.push('/admin/dashboard/questions')}>
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Dozazník' />
                  </ListItem>
                </List>
              </Drawer>
              <Box component='main' className={styles.dashboard}>
                <Component {...pageProps} />
              </Box>
            </Box>
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
