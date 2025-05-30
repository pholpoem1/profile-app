import { Box, Container, IconButton, useMediaQuery, useTheme } from '@mui/material';

import { Lato } from 'next/font/google';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuMobile from './MenuMobile';
import { ProfileProvider, useProfileContext } from '@/contexts/ProfileProvider';
import ProgressBar from './ProgressBar';
import ScrollTop from './ScrollTop';
import ToggleThemeButton from './ToggleThemeButton';
import Header from './Header';

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
      <main className={lato.className} id="main">
        <Box>
          <div className="glow-bg glow-circle"></div>
          <div className="glow-bg glow-oval"></div>
          <Header />
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
              <IconButton onClick={handleClick}>
                <MenuRoundedIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
          <MenuMobile anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
          <Container maxWidth={'lg'} disableGutters sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
            {children}
          </Container>
        </Box>
        <ToggleThemeButton toggleColorMode={() => setDarkMode(!darkMode)} />
        <ScrollTop />
      </main>
    </ProfileProvider>
  );
};

export default LayoutPage;
