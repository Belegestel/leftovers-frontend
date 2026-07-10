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

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const showSnackbar = useSnackbar();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit = emailValid;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    try {
      setLoading(true);
      const response = await forgotPassword({
        email,
      });
      showSnackbar({
        message:
          'Thanks! An e-mail was sent that will ask you to click on a link to verify that you own this account 📬',
      });
      onClose();
    } catch (error: unknown) {
      showSnackbar({ message: 'Password reset failed, verify your e-mail' });
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
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          Forgot password
        </Typography>

        <Typography sx={{ paddingBottom: 3 }}>
          No worries! Enter your email address below, and we'll send you a link
          to reset your password.
        </Typography>

        <TextField
          label="E-mail address*"
          placeholder="Enter your email"
          value={email}
          error={!emailValid && email.length > 0}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
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

        {!emailValid && email.length > 0 && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            Enter a valid email
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
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{ mt: 1, height: 32, width: 123 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Send e-mail'
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
