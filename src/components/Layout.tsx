import { Box, Container, FormControlLabel, Switch } from "@mui/material";

import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap"
});

const LayoutPage = ({
  children,
  darkMode,
  setDarkMode
}: {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <main className={lato.className}>
      <Box>
        <Box sx={{ position: "fixed", top: 8, right: 16, zIndex: 1300 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
            label="Dark Mode"
          />
        </Box>
        <Container
          maxWidth="lg"
          disableGutters
          sx={{ px: { xs: 2, md: 4 }, py: 4 }}
        >
          {children}
        </Container>
      </Box>
    </main>
  );
};

export default LayoutPage;
