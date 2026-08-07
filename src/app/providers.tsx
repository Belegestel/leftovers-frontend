import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '@/theme/theme';
import { SnackbarProvider } from '@/components/common/SnackbarProvider';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
