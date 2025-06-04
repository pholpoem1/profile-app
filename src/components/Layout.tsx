import { Box, Container, Fab, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Lato } from 'next/font/google';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuMobile from './MenuMobile';
import { ProfileProvider } from '@/contexts/ProfileProvider';
import ProgressBar from './ProgressBar';
import ScrollTop from './ScrollTop';
import Header from './Header';
import { useState } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import Footer from './Footer';

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
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const handleClick = () => {
    setIsOpenMenu((preState) => !preState);
  };

  return (
    <ProfileProvider>
      <main className={lato.className} id="main">
        <Box>
          <Header toggleColorMode={() => setDarkMode(!darkMode)} />
          <ProgressBar />
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
              <>
                <Fab
                  size="small"
                  sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'transparent' }}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {theme.palette.mode === 'dark' ? (
                    <LightModeIcon fontSize="small" sx={{ color: '#f5b942' }} />
                  ) : (
                    <NightlightIcon fontSize="small" sx={{ color: 'black' }} />
                  )}
                </Fab>
                <IconButton onClick={handleClick}>
                  <MenuRoundedIcon fontSize="large" />
                </IconButton>
              </>
            )}
          </Box>
          <MenuMobile isOpenMenu={isOpenMenu} toggleDrawer={handleClick} />
          <Container
            maxWidth={'lg'}
            disableGutters
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 4, md: 0 },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {children}
          </Container>
          <Footer />
          {/* <ToggleThemeButton toggleColorMode={() => setDarkMode(!darkMode)} /> */}
          <ScrollTop />
        </Box>
      </main>
    </ProfileProvider>
  );
};

export default LayoutPage;
