import { createTheme } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    customBackground: {
      gradient: string;
    };
  }

  interface ThemeOptions {
    customBackground?: {
      gradient: string;
    };
  }
}

export const getAppTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#ec4899" : red[700]
      },
      background: {
        default: darkMode ? "#121212" : "#fff",
        paper: darkMode ? grey[900] : "#fff"
      }
    },
    typography: {
      fontFamily: `'Lato'`
    },
    customBackground: {
      gradient: darkMode
        ? "linear-gradient(to right, rgba(18,18,18,0.95), rgba(55,0,60,0.95), rgba(0,0,0,0.95))"
        : "linear-gradient(to right, rgba(227,253,245,0.9), rgba(255,230,250,0.9), rgba(255,255,255,0.9))"
    }
  } as const);
