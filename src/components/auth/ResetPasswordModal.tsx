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

interface ResetPasswordModalProps {
  open: boolean;
  onClose: (isPwdChanged?: boolean) => void;
}

export function ResetPasswordModal({ open, onClose }: ResetPasswordModalProps) {
  const showSnackbar = useSnackbar();

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = password == repeatPassword && password.length > 8;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    try {
      setLoading(true);
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) {
        throw new Error('Missing reset token');
      }
      const response = await resetPassword({
        token,
        newPassword: password,
      });
      onClose(true);
    } catch (error: unknown) {
      showSnackbar({ message: 'Password reset failed' });
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
        <IconButton onClick={() => onClose()} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          Forgot password
        </Typography>

        <Typography sx={{ paddingBottom: 3 }}>
        Please ensure your password is a minumum of 8 characters long. Ideally, include a mix of both letters and numbers.
        </Typography>

        <TextField
          label="New password*"
          placeholder="Type new password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
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

        <TextField
          label="Repeat new password*"
          placeholder="Type new password again"
          value={repeatPassword}
          type={showRepeatPassword ? 'text' : 'password'}
          onChange={(event) => {
            setRepeatPassword(event.target.value);
          }}
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
                    onClick={() => setShowRepeatPassword((previous) => !previous)}
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
        {password != repeatPassword && (
          <Typography color='error' sx={{fontSize:12}}>
          Both passwords must be the same
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
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{ mt: 1, height: 32, width: 180 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Reset my password'
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
