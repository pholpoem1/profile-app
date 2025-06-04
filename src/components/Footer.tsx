import { Box, Container, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  return (
    <Box component="footer" bgcolor={theme.palette.grey[900]} color="white" py={6}>
      <Container maxWidth="lg">
        <Box textAlign="center">
          <Typography variant="caption" color="grey.500">
            © 2025 Jintana Pholpoem. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
