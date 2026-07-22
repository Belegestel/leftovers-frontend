import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/footer/Footer';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/services/tokenService';
import { RequireLoginModal } from '@/components/auth/RequireLoginModal';
import { useTranslation } from 'react-i18next';
import i18n, { supportedLanguages } from '@/i18n';

export function RootLayout() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

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
  const handleRequireLoginRedirectLogin = () => {
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
  const handleRequireLoginRecipeRateModal =
    searchParams.get('rateLogin') === 'true';
  const handleRequireLoginRecipeRateClose = () => {
    navigate(location.pathname, { replace: true });
  };

  const { lang } = useParams();
  useEffect(() => {
    const language = supportedLanguages.includes(lang ?? '') ? lang : 'en';
    i18n.changeLanguage(language);
  }, [lang]);
  if (i18n.language !== lang && lang !== undefined) { return null; }

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
        title={t('modals.requireLogin.saveTitle')}
        message={t('modals.requireLogin.saveMessage')}
        onClose={handleRequireLoginRecipeSaveClose}
        onLogin={handleRequireLoginRedirectLogin}
      />
      <ForgotPasswordModal
        open={handleForgotPasswordModal}
        onClose={handleForgotPasswordClose}
      />
      <ResetPasswordModal
        open={handleResetPasswordModal}
        onClose={handleResetPasswordClose}
      />
      <RequireLoginModal
        open={handleRequireLoginRecipeRateModal}
        title={t('modals.requireLogin.rateTitle')}
        message={t('modals.requireLogin.rateMessage')}
        onClose={handleRequireLoginRecipeRateClose}
        onLogin={handleRequireLoginRedirectLogin}
      />
    </Box>
  );
}
