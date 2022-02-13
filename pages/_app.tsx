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
} from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
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
  const { pathname } = useRouter();

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

  console.log(isAdmin);
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
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
