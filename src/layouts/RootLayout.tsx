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
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import { useState } from 'react';
import { isAuthenticated } from '@/services/tokenService';

export function RootLayout() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignupOpenModal = searchParams.get('signup') === 'true';
  const handleSignupClose = () =>
    navigate({ pathname: location.pathname, search: '' });
  const handleLoginOpenModal = searchParams.get('login') === 'true';
  const handleLogin = () => {
    setAuthenticated(true);
  };
  const handleLoginClose = () => {
    navigate(location.pathname, { replace: true });
  };
  const handleForgotPasswordModal =
    searchParams.get('forgot-password') === 'true';
  const handleForgotPasswordClose = () =>
    navigate(window.location.pathname, { replace: true });
  const handleResetPasswordModal =
    searchParams.get('reset-password') === 'true';
  const handleResetPasswordClose = (isPwdChanged: boolean | undefined) => {
    navigate(
      { pathname: window.location.pathname, search: isPwdChanged ? '?login=true' : ''},
      {replace:true}
    )
  }

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

      <RegisterModal open={handleSignupOpenModal} onClose={handleSignupClose} />
      <LoginModal
        open={handleLoginOpenModal}
        onLogin={handleLogin}
        onClose={handleLoginClose}
      />
      <ForgotPasswordModal
        open={handleForgotPasswordModal}
        onClose={handleForgotPasswordClose}
      />
      <ResetPasswordModal
        open={handleResetPasswordModal}
        onClose={handleResetPasswordClose}
      />
    </Box>
  );
}
