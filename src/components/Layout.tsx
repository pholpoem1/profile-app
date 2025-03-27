import { Box, Container, FormControlLabel, Switch } from "@mui/material";

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
    <main>
      <Box
      // sx={{
      //   bgcolor: darkMode ? "#121212" : "#fff",
      //   color: darkMode ? "#eee" : "#111",
      //   minHeight: "100vh"
      // }}
      >
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
