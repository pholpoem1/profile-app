import { SECTIONS_MENU } from '@/utils/constants';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useAuth } from './useAuth';

const Header = () => {
  const sectionMenu = SECTIONS_MENU;
  const { user, loading: authLoading } = useAuth();

  return (
    <AppBar
      component="nav"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        opacity: 0.7,
        color: theme.palette.text.secondary,
      })}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          Jintana Ph
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '16px' }}>
          <>
            {user ? (
              <Button
                LinkComponent={'a'}
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
                href={'/admin'}
              >
                <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>Logout</Typography>
              </Button>
            ) : (
              <>
                {sectionMenu.map((item) => (
                  <Button
                    key={item}
                    LinkComponent={'a'}
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
                    href={`/#${item}`}
                  >
                    <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {item.toUpperCase()}
                    </Typography>
                  </Button>
                ))}
              </>
            )}
          </>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
