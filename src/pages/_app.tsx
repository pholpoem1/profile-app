import LayoutPage from '@/components/Layout';
import '@/styles/globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { getGoogleTheme } from '@/styles/googleTheme';
import '@/styles/glow-background.css';
import 'aos/dist/aos.css';

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');

    if (stored === 'true') {
      setDarkMode(true);
    } else if (stored === 'false') {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const theme = useMemo(() => getGoogleTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LayoutPage setDarkMode={setDarkMode} darkMode={darkMode}>
          <Head>
            <title>Jintana' s Profile</title>
          </Head>
          <Component {...pageProps} />
        </LayoutPage>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
