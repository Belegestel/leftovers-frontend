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
import { RequireLoginModal } from '@/components/auth/RequireLoginModal';

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
  const handleRequireLoginRecipeSaveModal =
    searchParams.get('saveLogin') === 'true';
  const handleRequireLoginRecipeSaveClose = () => {
    navigate(location.pathname, { replace: true });
  };
  const handleRequireLoginToSaveLogin = () => {
    navigate(`${location.pathname}?login=true`);
  };
  const handleForgotPasswordModal =
    searchParams.get('forgot-password') === 'true';
  const handleForgotPasswordClose = () =>
    navigate(location.pathname, { replace: true });
  const handleResetPasswordModal =
    searchParams.get('reset-password') === 'true';
  const handleResetPasswordClose = (isPwdChanged: boolean | undefined) => {
    navigate(
      {
        pathname: location.pathname,
        search: isPwdChanged ? '?login=true' : '',
      },
      { replace: true }
    );
  };

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
      <RequireLoginModal
        open={handleRequireLoginRecipeSaveModal}
        title="Login to save the recipe"
        message="If you want to save this recipe you need to login or create an account. Don't miss out on the convenience of having your favorite recipes at your fingertips whenever you crave them!"
        onClose={handleRequireLoginRecipeSaveClose}
        onLogin={handleRequireLoginToSaveLogin}
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
