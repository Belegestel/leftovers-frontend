import { useState } from 'react';
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
import { useForm } from 'react-hook-form';

interface LoginModalProps {
  open: boolean;
  onClose: (isPwdChanged: boolean) => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
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
      setLoading(true);
      const response = await login({
        email: data.email,
        password: data.password,
      });
      setToken(response.accessToken, data.rememberMe);
      onClose(false);
    } catch (error: unknown) {
      if (error.response?.status === 401) {
        setLoginMessage('Login failed - invalid credentials');
      } else {
        setLoginMessage('Login failed');
      }
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
        <IconButton onClick={() => onClose(false)}>
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
          error={!!errors.email}
          {...registerField('email', {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email'
            },
            onChange: () => setLoginMessage('')
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
            Enter a valid email
          </Typography>
        )}

        <TextField
          label="Password*"
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          {...registerField('password', {
            required: true,
            onChange: () => setLoginMessage('')
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
          <Link
            href={`${location.pathname}?forgot-password=true`}
            sx={{ color: 'text.secondary', fontSize: 12 }}
          >
            Forgot your password?
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
            disabled={!isValid || loading}
            onClick={handleSubmit(submit)}
            sx={{ mt: 1, height: 32, width: 80 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Log in'
            )}
          </Button>
          <Typography color="error" sx={{ mt: 1.5 }}>
            {loginMessage}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">Remember me</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
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
