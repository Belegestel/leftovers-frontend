import { useState } from 'react';
import { forgotPassword } from '@/services/authService';
import {
  Box,
  Dialog,
  IconButton,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../common/SnackbarProvider';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ForgotPasswordFormValues {
  email: string;
}

export function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const showSnackbar = useSnackbar();

  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const { t } = useTranslation();

  const submit = async (data: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      const response = await forgotPassword({
        email: data.email,
      });
      showSnackbar({
        message: `${t('modals.forgot.snackbar.success')} 📬`,
      });
      onClose();
    } catch (error: unknown) {
      showSnackbar({ message: t('modals.forgot.snackbar.fail') });
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
        <IconButton onClick={onClose} aria-label={t('modals.close')}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          {t('modals.forgot.title')}
        </Typography>

        <Typography sx={{ paddingBottom: 3 }}>
          {t('modals.forgot.desc')}
        </Typography>

        <TextField
          label={`${t('modals.emailLabel')}*`}
          placeholder={t('modals.emailPlaceholder')}
          error={!!errors.email}
          {...registerField('email', {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('modals.emailFail'),
            },
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
            paddingBottom: 3,
          }}
        />

        {errors.email && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            {t('modals.emailFail')}
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
            onClick={onClose}
            sx={{ mt: 1, height: 32, width: 80 }}
          >
            {t('modals.cancel')}
          </Button>

          <Button
            variant="contained"
            disabled={!isValid || loading}
            onClick={handleSubmit(submit)}
            sx={{ mt: 1, height: 32, width: 123 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              t('modals.forgot.send')
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
