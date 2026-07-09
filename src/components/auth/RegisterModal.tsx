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

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const showSnackbar = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit =
    emailValid && password.length > 8 && termsAccepted && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await register({
        email,
        password,
      });

      showSnackbar({
        message:
          "You've successfully registered on our website. To complete the registration process, please check your email 📬",
      });
      onClose();
    } catch (error) {
      showSnackbar({
        message: 'Registration failed. Please try again.',
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
          Sign up
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Create an account for free
        </Typography>

        <TextField
          label="E-mail address*"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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

        <TextField
          label="Password*"
          placeholder="Create a password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => setPassword(event.target.value)}
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
                  aria-label='toggle password visibility'
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

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">
            {' '}
            Acceptance of{' '}
            <Link
              href="/tos"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Terms & conditions
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Privacy Policy
            </Link>{' '}
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{ mt: 1, height: 44 }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Create an account'
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
            underline="always"
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
