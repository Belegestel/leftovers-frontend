import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSnackbar } from '../common/SnackbarProvider';
import { render, screen, waitFor } from '@testing-library/react';
import { ResetPasswordModal } from './ResetPasswordModal';
import userEvent from '@testing-library/user-event';
import { resetPassword } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  resetPassword: vi.fn(),
}));
vi.mock('../common/SnackbarProvider', () => ({
  useSnackbar: vi.fn(),
}));

describe('ResetPasswordModal', () => {
  const onClose = vi.fn();
  const showSnackbar = vi.fn();

  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue(showSnackbar);
    window.history.pushState({}, '', '/reset-password?token=test-token');
  });
  function renderModal() {
    render(<ResetPasswordModal open={true} onClose={onClose} />);
  }

  it('renders the reset password modal', () => {
    renderModal();
    expect(screen.getByText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password*')).toBeInTheDocument();
    expect(screen.getByLabelText('Repeat new password*')).toBeInTheDocument();
  });

  it('keeps submit disabled until passwords match and are long enough', async () => {
    renderModal();

    const button = screen.getByRole('button', { name: 'Reset my password' });
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText('New password*'), 'password123');
    expect(button).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText('Repeat new password*'),
      'password123'
    );
    expect(button).toBeEnabled();
  });

  it('shows mismatch error when passwords differ', async () => {
    renderModal();

    await userEvent.type(screen.getByLabelText('New password*'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Repeat new password*'),
      'password456'
    );
    expect(
      screen.getByText('Both passwords must be the same')
    ).toBeInTheDocument();
  });

  it('calls onClose(true) after successful password reset', async () => {
    vi.mocked(resetPassword).mockResolvedValue({});

    renderModal();

    await userEvent.type(screen.getByLabelText('New password*'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Repeat new password*'),
      'password123'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset my password' })
    );
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        token: 'test-token',
        newPassword: 'password123',
      });
    });
    expect(onClose).toHaveBeenCalledWith(true);
  });

  it('shows snackbar when password reset fails', async () => {
    vi.mocked(resetPassword).mockRejectedValue(new Error('Failed'));

    renderModal();

    await userEvent.type(screen.getByLabelText('New password*'), 'password123');
    await userEvent.type(
      screen.getByLabelText('Repeat new password*'),
      'password123'
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Reset my password' })
    );

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith({
        message: 'Password reset failed',
      });
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes without redirecting to login when clicking cancel', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledWith();
  });

  it('closes without redirecting to login when clicking close', async () => {
    renderModal();
    await userEvent.click(screen.getByLabelText('close'));
    expect(onClose).toHaveBeenCalledWith();
  });
});
