import { useState } from 'react';
import { useSnackbar } from '../common/SnackbarProvider';
import { login } from '@/services/authService';
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
import { setToken } from '@/services/tokenService';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const showSnackbar = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit = emailValid && password.length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      const response = await login({
        email,
        password,
      });
      setToken(response.accessToken, rememberMe);
      onClose();
    } catch (error) {
      showSnackbar({
        message: 'Login failed. Please try again.',
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
          Log in
        </Typography>

        <TextField
          label="E-mail address*"
          placeholder="Enter your email"
          value={email}
          error={!emailValid && email.length > 0}
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

        {!emailValid && email.length > 0 && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            Enter a valid email
          </Typography>
        )}

        <TextField
          label="Password*"
          placeholder="Enter your password"
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
                    aria-label="toggle password visibility"
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
          <Link href="#" sx={{ color: 'text.secondary', fontSize: 12 }}>
            Forgot your password?
          </Link>
        </Box>

        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{ mt: 1, height: 32, width: 80 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Log in'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">Remember me</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Don't have an account yet?{' '}
          <Link
            href={`${location.pathname}?signup=true`}
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
            underline="always"
          >
            Create an account
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
