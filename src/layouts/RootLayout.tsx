import { Outlet } from 'react-router';
import { Box, Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';

export function RootLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
