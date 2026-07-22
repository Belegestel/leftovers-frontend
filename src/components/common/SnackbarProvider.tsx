import { Typography, Paper, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type SnackbarState = {
  message: string;
};

const SnackbarContext = createContext<(state: SnackbarState) => void>(() => {});

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const { t } = useTranslation();

  return (
    <SnackbarContext.Provider value={setSnackbar}>
      {children}
      {snackbar && (
        <Snackbar
          open={!!snackbar}
          autoHideDuration={5000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Paper
            elevation={4}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content',
              maxWidth: '90vw',
              borderRadius: 1,
              px: 2,
              py: 1,
              color: 'text.primary',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                mr: 1,
              }}
            >
              {snackbar.message}
            </Typography>

            <IconButton
              size="small"
              onClick={() => setSnackbar(null)}
              aria-label={t('modals.close')}
              sx={{ p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
