import LayoutPage from "@/components/Layout";
import "@/styles/globals.css";
import "ckeditor5/ckeditor5.css";
import "@/styles/ckeditor.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { getAppTheme } from "@/styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // const theme = useMemo(
  //   () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
  //   [darkMode]
  // );
  const theme = useMemo(() => getAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LayoutPage setDarkMode={setDarkMode} darkMode={darkMode}>
          <Component {...pageProps} />
        </LayoutPage>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
