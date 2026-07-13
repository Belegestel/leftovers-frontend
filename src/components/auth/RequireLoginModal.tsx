import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RequireLoginModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onLogin: () => void;
}

export function RequireLoginModal({
  open,
  title,
  message,
  onClose,
  onLogin,
}: RequireLoginModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1,
            padding: 3,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4">{title}</Typography>

        <Typography color="text.secondary">{message}</Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" onClick={onLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
