import { useState } from 'react';
import { useSnackbar } from '../common/SnackbarProvider';
import { register } from '@/services/authService';
import {
  Box,
  Link,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

interface RegisterFormValues {
  email: string;
  password: string;
  termsAccepted: boolean;
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const showSnackbar = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const {
    register: registerField,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      termsAccepted: false,
    },
  });

  const password = watch('password');

  const MIN_PASSWORD_LENGTH = 8;

  const submit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      await register({
        email: data.email,
        password: data.password,
      });

      showSnackbar({
        message: `${t('modals.register.snackbar.success')} 📬`,
      });
      reset();
      onClose();
    } catch (error) {
      showSnackbar({
        message: t('modals.register.snackbar.fail'),
      });
    } finally {
      setLoading(false);
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
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          {t('modals.register.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('modals.register.description')}
        </Typography>

        <TextField
          label={`${t('modals.emailLabel')}*`}
          placeholder={t('modals.emailPlaceholder')}
          {...registerField('email', {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('modals.emailFail'),
            },
          })}
          error={!!errors.email}
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
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: t('modals.passwordLength', {
                length: MIN_PASSWORD_LENGTH,
              }),
            },
          })}
          fullWidth
          error={password.length < MIN_PASSWORD_LENGTH && password.length > 0}
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
                  <IconButton
                    aria-label={t('modals.passwordVisToggle')}
                    onClick={() => setShowPassword((previous) => !previous)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {errors.password && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            {t('modals.passwordLength', { length: MIN_PASSWORD_LENGTH })}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            justifyContent: 'left',
          }}
        >
          <input
            type="checkbox"
            {...registerField('termsAccepted', {
              required: true,
            })}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">
            <Trans
              i18nKey="modals.register.terms"
              components={{
                terms: (
                  <Link
                    href="/tos"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'text.primary', fontWeight: 'bold' }}
                  />
                ),
                privacy: (
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'text.primary', fontWeight: 'bold' }}
                  />
                ),
              }}
            />
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!isValid}
          onClick={handleSubmit(submit)}
          sx={{ mt: 1, height: 44, width: 220 }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            t('modals.register.submit')
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
        {`${t('modals.register.goLoginPrompt')} `}
          <Link
            href={`${location.pathname}?login=true`}
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
            underline="always"
          >
          {t('modals.register.login')}
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
