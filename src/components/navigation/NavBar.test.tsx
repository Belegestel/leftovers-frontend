import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from './NavBar';
import { isAuthenticated, removeToken } from '@/auth/authService';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockedNavigate = vi.fn();
const mockedLocation = vi.fn();

vi.mock('@/auth/authService', () => ({
  isAuthenticated: vi.fn(),
  removeToken: vi.fn(),
}));
vi.mock('react-router', () => ({
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));
vi.mock('@/hooks/useRecipeCategories', () => ({
  useRecipeCategories: () => ({
    categories: [{ name: 'All categories' }, { name: 'breakfast' }],
    loading: false,
  }),
}));

describe('NavBar', () => {
  it('shows login and signup when logged out', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(false);
    render(<NavBar />);

    await waitFor(() => {
      expect(screen.queryByText('Log in')).toBeInTheDocument();
    });
    expect(screen.queryByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText('Add recipe')).not.toBeInTheDocument();
  });

  it('shows authenticated controls when logged in', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(true);
    render(<NavBar />);

    await waitFor(() => {
      expect(screen.queryByText('Add recipe')).toBeInTheDocument();
    });
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
    expect(screen.queryByText('Add recipe')).toBeInTheDocument();
  });

  it('opens account menu', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(true);
    render(<NavBar />);

    await waitFor(() => {
      expect(screen.queryByText('Add recipe')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('My account'));

    expect(screen.queryByText('Saved recipes')).toBeInTheDocument();
    expect(screen.queryByText('My recipes')).toBeInTheDocument();
  });

  it('logs the user out', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(true);
    render(<NavBar />);

    await waitFor(() =>
      expect(screen.queryByText('My account')).toBeInTheDocument()
    );
    await userEvent.click(screen.getByText('My account'));
    await userEvent.click(screen.getByText('Log out'));
    expect(removeToken).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
