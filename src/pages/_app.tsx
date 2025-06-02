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
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />

            <meta
              name="description"
              content="Hi, I'm Jintana — a frontend developer passionate about building intuitive and performant web apps using React and Next.js."
            />
            <meta
              name="keywords"
              content="Frontend Developer, Web Developer, React, Next.js, Tailwind CSS, Portfolio, Jintana, Thai Developer, UI UX"
            />
            <meta name="author" content="Jintana Pholpoem" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.jintana-ph.com/" />
            <meta property="og:title" content="Jintana Pholpoem | Frontend Developer" />
            <meta
              property="og:description"
              content="Explore my portfolio showcasing projects built with modern web technologies."
            />
            <meta property="og:image" content="https://www.jintana-ph.com/og-image.png" />
          </Head>
          <Component {...pageProps} />
        </LayoutPage>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
