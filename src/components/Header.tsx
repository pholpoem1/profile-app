import { SECTIONS_MENU } from '@/utils/constants';
import { AppBar, Box, Button, Fab, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from './useAuth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useRouter } from 'next/router';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useProfileContext } from '@/contexts/ProfileProvider';
import MenuMobile from './MenuMobile';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export const smoothScrollTo = (targetY: number, duration = 1000) => {
  const startY = window.scrollY;
  const startTime = performance.now();

  const scroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // [0-1]
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    window.scrollTo(0, startY + (targetY - startY) * ease);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

const Header = ({ toggleColorMode }: { toggleColorMode: () => void }) => {
  const theme = useTheme();
  const sectionMenu = SECTIONS_MENU;
  const { user } = useAuth();
  const router = useRouter();
  const { asPath } = router;
  const { active, setActive } = useProfileContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const handleClick = () => {
    setIsOpenMenu((preState) => !preState);
  };

  return (
    <AppBar
      component="nav"
      sx={(theme) => {
        return {
          backgroundColor: theme.palette.background.paper,
          opacity: theme.palette.mode === 'dark' ? 1 : 0.7,
          color: theme.palette.text.secondary,
        };
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Jintana Ph
        </Typography>
        <Box sx={{ gap: '16px' }}>
          {isMobile ? (
            <IconButton onClick={handleClick}>
              <MenuRoundedIcon fontSize="large" />
            </IconButton>
          ) : (
            <>
              {asPath === '/myadminmanager' ? (
                <>
                  {user ? (
                    <Button
                      sx={{
                        padding: '8px 16px',
                        borderRadius: '24px',
                        ':hover': {
                          transition: '0.3s',
                        },
                      }}
                      onClick={() => signOut(auth)}
                    >
                      <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>Logout</Typography>
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        padding: '8px 16px',
                        borderRadius: '24px',
                        ':hover': {
                          transition: '0.3s',
                        },
                        ':active': {
                          backgroundColor: 'rgba(42, 86, 198, 0.5)',
                        },
                      }}
                      onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
                    >
                      <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>Login</Typography>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {sectionMenu.map((item) => (
                    <Button
                      key={item}
                      LinkComponent={'a'}
                      sx={{
                        padding: '8px 16px',
                        borderRadius: '24px',
                      }}
                      className={`menu-item` + (active === item ? ' active' : '')}
                      href={`#${item}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item);
                        if (el) {
                          smoothScrollTo(el.offsetTop, 1000);
                          setActive(item);
                        }
                      }}
                    >
                      <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
                        {item.toUpperCase()}
                      </Typography>
                    </Button>
                  ))}
                </>
              )}
            </>
          )}

          <Fab
            size="medium"
            sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'transparent' }}
            onClick={toggleColorMode}
          >
            {theme.palette.mode === 'dark' ? (
              <LightModeIcon fontSize="small" sx={{ color: '#f5b942' }} />
            ) : (
              <NightlightIcon fontSize="small" sx={{ color: 'black' }} />
            )}
          </Fab>
          <MenuMobile isOpenMenu={isOpenMenu} toggleDrawer={handleClick} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
