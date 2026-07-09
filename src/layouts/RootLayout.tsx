import { Outlet, useLocation, useNavigate } from 'react-router';
import { Box, Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';
import { RegisterModal } from '@/components/auth/RegisterModal';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const signupOpen =
    new URLSearchParams(location.search).get('signup') === 'true';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />

      <RegisterModal
        open={signupOpen}
        onClose={() => navigate({ pathname: location.pathname, search: '' })}
      />
    </Box>
  );
}
