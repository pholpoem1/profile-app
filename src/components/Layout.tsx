import { Box, Container, IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
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
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <LightModeIcon fontSize="large" sx={{ color: "#f5b942" }} />
            ) : (
              <NightlightIcon fontSize="large" sx={{ color: "black" }} />
            )}
          </IconButton>
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
