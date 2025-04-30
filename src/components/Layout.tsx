import { Box, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Lato } from 'next/font/google';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuMobile from './MenuMobile';
import { ProfileProvider, useProfileContext } from '@/contexts/ProfileProvider';
import ProgressBar from './ProgressBar';

const lato = Lato({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const LayoutPage = ({
  children,
  darkMode,
  setDarkMode,
}: {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setAnchorEl, anchorEl } = useProfileContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <ProfileProvider>
      <main className={lato.className}>
        <Box>
          <ProgressBar />
          <Box sx={{ position: 'fixed', top: 8, right: 64, zIndex: 1300 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <LightModeIcon fontSize="large" sx={{ color: '#f5b942' }} />
              ) : (
                <NightlightIcon fontSize="large" sx={{ color: 'black' }} />
              )}
            </IconButton>
          </Box>
          <Box
            sx={{
              position: 'fixed',
              top: 8,
              right: 16,
              zIndex: 1300,
              display: 'flex',
              gap: 2,
            }}
          >
            {isMobile && (
              <IconButton onClick={handleClick}>
                <MenuRoundedIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
          <MenuMobile anchorEl={anchorEl} setAnchorEl={setAnchorEl} />

          {/* {!isMobile && (
          <Box
            sx={{
              width: 220,
              position: 'fixed',
              top: 64,
              left: 0,
              // height: "100vh",
              overflowY: 'auto',
              zIndex: 1100,
            }}
          >
            <NavigationStepper active={active} sections={SECTIONS_MENU} onSelect={(s) => {}} />
          </Box>
        )} */}

          <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
            {children}
          </Container>
        </Box>
      </main>
    </ProfileProvider>
  );
};

export default LayoutPage;
