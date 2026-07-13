import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { useState } from 'react';
import { isAuthenticated } from '@/services/tokenService';

export function RootLayout() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignupOpenModal = searchParams.get('signup') === 'true';
  const handleLoginOpenModal = searchParams.get('login') === 'true';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar
        authenticated={authenticated}
        onLogout={() => setAuthenticated(false)}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />

      <RegisterModal
        open={handleSignupOpenModal}
        onClose={() => navigate({ pathname: location.pathname, search: '' })}
      />
      <LoginModal
        open={handleLoginOpenModal}
        onLogin={() => setAuthenticated(true)}
        onClose={() => {
          navigate(location.pathname, { replace: true });
        }}
      />
    </Box>
  );
}
