import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSnackbar } from '../common/SnackbarProvider';
import { RegisterModal } from './RegisterModal';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { register } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  register: vi.fn(),
}));

vi.mock('../common/SnackbarProvider.tsx', () => ({
  useSnackbar: vi.fn(),
}));

describe('RegisterModal', () => {
  const mockClose = vi.fn();
  const mockSnackbar = vi.fn();

  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue(mockSnackbar);
  });

  it('renders registration form', () => {
    render(<RegisterModal open={true} onClose={mockClose} />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail address*')).toBeInTheDocument();
    expect(screen.getByLabelText('Password*')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('disables create account button initially', () => {
    render(<RegisterModal open={true} onClose={mockClose} />);
    expect(
      screen.getByRole('button', { name: 'Create an account' })
    ).toBeDisabled();
  });

  it('enables create account button after valid input and accepting terms', async () => {
    const user = userEvent.setup();
    render(<RegisterModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    expect(
      screen.getByRole('button', { name: 'Create an account' })
    ).toBeEnabled();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<RegisterModal open={true} onClose={mockClose} />);
    const passwordField = screen.getByLabelText('Password*');
    expect(passwordField).toHaveAttribute('type', 'password');
    await user.click(screen.getByLabelText('toggle password visibility'));
    expect(passwordField).toHaveAttribute('type', 'text');
  });

  it('registers successfully and shows snackbar', async () => {
    const user = userEvent.setup();
    vi.mocked(register).mockResolvedValue({
      message: 'Confirmation email sent',
    });
    render(<RegisterModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create an account' }));
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        email: 'john.doe@email.com',
        password: 'password123',
      });
    });
    expect(mockSnackbar).toHaveBeenCalledWith({
      message:
        "You've successfully registered on our website. To complete the registration process, please check your email 📬",
    });
    expect(mockClose).toHaveBeenCalled();
  });

  it('shows error snackbar when registration fails', async () => {
    const user = userEvent.setup();
    vi.mocked(register).mockRejectedValue(new Error('Failed'));
    render(<RegisterModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create an account' })
      ).toBeEnabled();
    });
    await user.click(screen.getByRole('button', { name: 'Create an account' }));
    await waitFor(() => {
      expect(mockSnackbar).toHaveBeenCalledWith({
        message: 'Registration failed. Please try again.',
      });
    });
    expect(mockClose).not.toHaveBeenCalled();
  });
});
