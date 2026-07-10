import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSnackbar } from '../common/SnackbarProvider';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { resetPassword } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  resetPassword: vi.fn(),
}));

vi.mock('../common/SnackbarProvider', () => ({
  useSnackbar: vi.fn(),
}));

describe('ForgotPasswordModal', () => {
  const onClose = vi.fn();
  const showSnackbar = vi.fn();

  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue(showSnackbar);
  });
  function renderModal() {
    render(<ForgotPasswordModal open={true} onClose={onClose} />);
  }

  it('renders the password modal', () => {
    renderModal();
    expect(screen.getByText('Forgot password')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail address*')).toBeInTheDocument();
  });

  it('closes when clicking Cancel', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking Cancel', async () => {
    renderModal();
    await userEvent.click(screen.getByLabelText('close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps submit disabled for invalid email', async () => {
    renderModal();

    const emailInput = screen.getByLabelText('E-mail address*');
    const submitButton = screen.getByRole('button', { name: 'Send e-mail' });
    await userEvent.type(emailInput, 'invalid-email');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('enables submit for a valid email', async () => {
    renderModal();
    const emailInput = screen.getByLabelText('E-mail address*');
    const submitButton = screen.getByRole('button', { name: 'Send e-mail' });
    await userEvent.type(emailInput, 'valid@email.com');
    expect(submitButton).toBeEnabled();
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
  });

  it('submits successfully and closes the modal', async () => {
    vi.mocked(resetPassword).mockResolvedValue({});
    renderModal();

    await userEvent.type(
      screen.getByLabelText('E-mail address*'),
      'valid@email.com'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send e-mail' }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({ email: 'valid@email.com' });
    });

    expect(showSnackbar).toHaveBeenCalledWith({
      message:
        'Thanks! An e-mail was sent that will ask you to click on a link to verify that you own this account 📬',
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows error snackbar when reset fails', async () => {
    vi.mocked(resetPassword).mockRejectedValue(new Error('Failed'));
    renderModal();

    await userEvent.type(
      screen.getByLabelText('E-mail address*'),
      'valid@email.com'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send e-mail' }));

    await waitFor(() => {
      expect(showSnackbar).toHaveBeenCalledWith({
        message: 'Password reset failed, verify your e-mail',
      });
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows loading state while submitting', async () => {
    vi.mocked(resetPassword).mockImplementation(() => new Promise(() => {}));

    renderModal();

    await userEvent.type(
      screen.getByLabelText('E-mail address*'),
      'valid@email.com'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Send e-mail' }));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
