import { createTheme } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";

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
    }
  });
