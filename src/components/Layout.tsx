import { Box, Container, IconButton, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Lato } from 'next/font/google';
import { RefObject, useEffect, useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuMobile from './MenuMobile';
import NavigationStepper from './NavigationStepper';
import { SectionKey } from '@/pages';
import { SECTIONS_MENU } from '@/utils/constants';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [active, setActive] = useState<SectionKey>('about');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // for (const key of sections) {
      //   const ref = sectionRefs[key];
      //   if (ref.current) {
      //     const rect = ref.current.getBoundingClientRect();
      //     if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      //       setActive(key);
      //       break;
      //     }
      //   }
      // }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: RefObject<HTMLElement | null>, name: SectionKey) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setActive(name);
      if (isMobile) setAnchorEl(null);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <main className={lato.className}>
      <Box>
        <LinearProgress
          variant="determinate"
          value={scrollProgress}
          sx={{
            height: 4,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1200,
          }}
        />
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

        {!isMobile && (
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
        )}

        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          {children}
        </Container>
      </Box>
    </main>
  );
};

export default LayoutPage;
