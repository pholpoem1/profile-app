import { Box, Container } from '@mui/material';
import { Lato } from 'next/font/google';
import { ProfileProvider } from '@/contexts/ProfileProvider';
import ProgressBar from './ProgressBar';
import ScrollTop from './ScrollTop';
import Header from './Header';
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
          ></Box>
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
          <ScrollTop />
        </Box>
      </main>
    </ProfileProvider>
  );
};

export default LayoutPage;
