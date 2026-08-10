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
        message:
          "You've successfully registered on our website. To complete the registration process, please check your email 📬",
      });
      reset();
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
          {...registerField('email', {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
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
            Enter a valid email
          </Typography>
        )}

        <TextField
          label="Password*"
          placeholder="Create a password"
          type={showPassword ? 'text' : 'password'}
          {...registerField('password', {
            minLength: {
              value: {MIN_PASSWORD_LENGTH},
              message: `Minimum password length is ${MIN_PASSWORD_LENGTH}`,
            },
          })}
          fullWidth
          error={password.length < MIN_PASSWORD_LENGTH && password.length > 0 }
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
                    aria-label="toggle password visibility"
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
            Minimum password length is {MIN_PASSWORD_LENGTH}
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
              required: true
            })}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">
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
          disabled={!isValid}
          onClick={handleSubmit(submit)}
          sx={{ mt: 1, height: 44, width: 220 }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Create an account'
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
          Already have an account?{' '}
          <Link
            href={`${location.pathname}?login=true`}
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
