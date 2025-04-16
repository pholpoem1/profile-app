import LayoutPage from "@/components/Layout";
import "@/styles/globals.css";
import { CssBaseline, ThemeProvider, GlobalStyles } from "@mui/material";
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

  const theme = useMemo(() => getAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundImage: theme.customBackground.gradient,
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            transition: "background-image 0.5s ease-in-out"
          }
        }}
      />
      <SnackbarProvider>
        <LayoutPage setDarkMode={setDarkMode} darkMode={darkMode}>
          <Component {...pageProps} />
        </LayoutPage>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
