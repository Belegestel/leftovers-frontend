import { Outlet, useLocation, useNavigate } from 'react-router';
import { Box, Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const signupOpen =
    new URLSearchParams(location.search).get('signup') === 'true';
  const loginOpen =
    new URLSearchParams(location.search).get('login') === 'true';
  const forgotPasswordOpen =
    new URLSearchParams(location.search).get('forgot-password') === 'true';
  const resetPasswordOpen =
    new URLSearchParams(location.search).get('reset-password') === 'true';

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
      <LoginModal
        open={loginOpen}
        onClose={() => {
          navigate(window.location.pathname, { replace: true });
          window.location.reload();
        }}
      />
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => {
          navigate(window.location.pathname, { replace: true });
        }}
      />
      <ResetPasswordModal
        open={resetPasswordOpen}
        onClose={(isPwdChanged: boolean | undefined) => {
          navigate(
            {
              pathname: window.location.pathname,
              search: isPwdChanged ? '?login=true' : '',
            },
            { replace: true }
          );
        }}
      />
    </Box>
  );
}
