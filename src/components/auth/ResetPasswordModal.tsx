import { useState } from 'react';
import { resetPassword } from '@/services/authService';
import {
  Box,
  Dialog,
  IconButton,
  TextField,
  Typography,
  Button,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../common/SnackbarProvider';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: (isPwdChanged?: boolean) => void;
}

interface ResetPasswordFormValues {
  password: string;
  repeatPassword: string;
}

export function ResetPasswordModal({ open, onClose }: ResetPasswordModalProps) {
  const showSnackbar = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  });
  const password = watch('password');

  const { t } = useTranslation();

  const submit = async (data: ResetPasswordFormValues) => {
    try {
      setLoading(true);
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) {
        throw new Error('Missing reset token');
      }
      await resetPassword({
        token,
        newPassword: password,
      });
      onClose(true);
    } catch (error: unknown) {
      showSnackbar({ message: t('modals.resetPassword.snackbar.fail') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 3 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => onClose()} aria-label={t('modals.close')}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          {t('modals.resetPassword.title')}
        </Typography>

        <Typography sx={{ paddingBottom: 3 }}>
          {t('modals.resetPassword.description')}
        </Typography>

        <TextField
          label={`${t('modals.resetPassword.newPasswordTitle')}*`}
          placeholder={t('modals.resetPassword.newPasswordPlaceholder')}
          type={showPassword ? 'text' : 'password'}
          {...registerField('password', {
            required: true,
            minLength: 9,
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

        <TextField
          label={t('modals.resetPassword.repeatTitle')}
          placeholder={t('modals.resetPassword.repeatPlaceholder')}
          type={showRepeatPassword ? 'text' : 'password'}
          {...registerField('repeatPassword', {
            required: true,
            validate: (value) =>
              value === password ||
              t('modals.resetPassword.passwordsDontMatch'),
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
                    onClick={() =>
                      setShowRepeatPassword((previous) => !previous)
                    }
                    edge="end"
                  >
                    {' '}
                    {showRepeatPassword ? (
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
        {errors.repeatPassword && (
          <Typography color="error" sx={{ fontSize: 12 }}>
            {t('modals.resetPassword.passwordsDontMatch')}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => onClose()}
            sx={{ mt: 1, height: 32, width: 80 }}
          >
            {t('modals.cancel')}
          </Button>

          <Button
            variant="contained"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit(submit)}
            sx={{ mt: 1, height: 32, width: 180 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              t('modals.resetPassword.submit')
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
