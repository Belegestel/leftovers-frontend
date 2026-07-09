import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSnackbar } from '../common/SnackbarProvider';
import { render, screen, waitFor } from '@testing-library/react';
import { LoginModal } from './LoginModal';
import userEvent from '@testing-library/user-event';
import { login } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  login: vi.fn(),
}));
vi.mock('../common/SnackbarProvider', () => ({
  useSnackbar: vi.fn(),
}));

describe('LoginModal', () => {
  const mockClose = vi.fn();
  const mockSnackbar = vi.fn();
  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue(mockSnackbar);
  });

  it('renders login form', () => {
    render(<LoginModal open={true} onClose={mockClose} />);

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail address*')).toBeInTheDocument();
    expect(screen.getByLabelText('Password*')).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('disables login button initially', () => {
    render(<LoginModal open={true} onClose={mockClose} />);
    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled();
  });

  it('enables login button after valid email and password', async () => {
    const user = userEvent.setup();
    render(<LoginModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
  });

  it('shows email verification error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe.email.com'
    );
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginModal open={true} onClose={mockClose} />);
    const passwordField = screen.getByLabelText('Password*');
    expect(passwordField).toHaveAttribute('type', 'password');
    await user.click(screen.getByLabelText('toggle password visibility'));
    expect(passwordField).toHaveAttribute('type', 'text');
  });

  it('logs in successfully and closes modal', async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({
      accessToken: 'fake-token',
    });
    render(<LoginModal open={true} onClose={mockClose} />);

    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    await user.type(
      screen.getByLabelText('E-mail address*'),
      'john.doe@email.com'
    );
    await user.type(screen.getByLabelText('Password*'), 'password123');
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'john.doe@email.com',
        password: 'password123',
      });
    });
    expect(mockClose).toHaveBeenCalled();
  });

  it('allows selecting "Remember me" checkbox', async () => {
    const user = userEvent.setup();
    render(<LoginModal open={true} onClose={mockClose} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
