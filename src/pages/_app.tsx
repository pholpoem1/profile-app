import LayoutPage from "@/components/Layout";
import "@/styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
// import { theme } from "@/styles/theme";
import type { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutPage setDarkMode={setDarkMode} darkMode={darkMode}>
        <Component {...pageProps} />
      </LayoutPage>
    </ThemeProvider>
  );
}
