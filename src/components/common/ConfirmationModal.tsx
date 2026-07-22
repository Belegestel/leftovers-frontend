import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmButton: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmButton,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          variant="secondary"
          sx={{
            border: '1px solid',
            borderColor: 'currentColor',
            py: 0.5,
            px: 2,
          }}
        >
          {t('modals.cancel')}
        </Button>

        <Button
          onClick={onConfirm}
          color="warning"
          variant="contained"
          sx={{ py: 0.5, px: 2 }}
        >
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
