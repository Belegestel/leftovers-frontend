import { useState } from 'react';
import { login } from '@/services/authService';
import {
  Box,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { setRefreshToken, setToken } from '@/services/tokenService';
import { useForm } from 'react-hook-form';
import { emailValid } from '@/utils/validation';
import { useAuth } from '@/context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
  open: boolean;
  onLogin: () => void;
  onClose: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginModal({ open, onLogin, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authChanged } = useAuth();

  const { t } = useTranslation();

  const {
    register: registerField,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const submit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await login({
        email: data.email,
        password: data.password,
      });
      setToken(response.accessToken, rememberMe);
      setRefreshToken(response.refreshToken, rememberMe);
      authChanged();
      onLogin();
      reset();
      onClose();
    } catch (error: unknown) {
      if (error.response?.status === 401) {
        setLoginMessage(t('modals.login.failCred'));
      } else {
        setLoginMessage(t('modals.login.fail'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 3 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          onClick={() => {
            reset();
            onClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          {t('modals.login.title')}
        </Typography>

        <TextField
          label={t('modals.emailLabel') + '*'}
          placeholder={t('modals.emailPlaceholder')}
          error={!!errors.email}
          {...registerField('email', {
            required: true,
            pattern: {
              value: emailValid,
              message: t('modals.emailFail'),
            },
            onChange: () => setLoginMessage(''),
          })}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'secondary',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary',
              },
            },
          }}
        />

        {errors.email && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            {t('modals.emailFail')}
          </Typography>
        )}

        <TextField
          label={`${t('modals.passwordLabel')}*`}
          placeholder={t('modals.passwordPlaceholder')}
          type={showPassword ? 'text' : 'password'}
          {...registerField('password', {
            required: true,
            onChange: () => setLoginMessage(''),
          })}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'secondary',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary',
              },
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {' '}
                  <IconButton
                    aria-label={t('modals.passwordVisToggle')}
                    onClick={() => setShowPassword((previous) => !previous)}
                    edge="end"
                  >
                    {' '}
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}{' '}
                  </IconButton>{' '}
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            component={RouterLink}
            to="?forgot-password=true"
            underline="always"
            sx={{ color: 'text.secondary', fontSize: 12 }}
          >
            {t('modals.login.forgot')}
          </Link>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="contained"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit(submit)}
            sx={{ mt: 1, height: 32, width: 80 }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              t('modals.login.login')
            )}
          </Button>
          <Typography color="error" sx={{ mt: 1.5 }}>
            {loginMessage}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <input
            type="checkbox"
            {...registerField('rememberMe')}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">{t('modals.login.rememberMe')}</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
          {`${t('modals.login.noAccount')} `}
          <Link
            component={RouterLink}
            to="?signup=true"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
            underline="always"
          >
            {t('modals.login.createAccount')}
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
