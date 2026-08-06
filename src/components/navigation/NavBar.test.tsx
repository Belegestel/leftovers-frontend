import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from './NavBar';
import { isAuthenticated, removeToken } from '@/services/tokenService';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AuthProvider } from '@/context/AuthContext';

const mockedNavigate = vi.fn();
const mockedLocation = vi.fn();
const mockedSetSearchParams = vi.fn();
const mockedSearchParams = { get: vi.fn(), set: vi.fn(), delete: vi.fn() };

vi.mock('@/services/tokenService', () => ({
  isAuthenticated: vi.fn(),
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
  useSearchParams: () => [mockedSearchParams, mockedSetSearchParams],
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
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Log in')).toBeInTheDocument();
    });
    expect(screen.queryByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText('Add recipe')).not.toBeInTheDocument();
  });

  it('shows authenticated controls when logged in', () => {
    render(
      <AuthProvider>
        <NavBar authenticated={true} onLogout={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByText('Add recipe')).toBeInTheDocument();
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });

  it('opens account menu', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={true} onLogout={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByText('Add recipe')).toBeInTheDocument();

    await userEvent.click(screen.getByText('My account'));

    expect(screen.getByText('Saved recipes')).toBeInTheDocument();
    expect(screen.getByText('My recipes')).toBeInTheDocument();
  });

  it('logs the user out', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(true);
    let authd = true;
    render(
      <AuthProvider>
        <NavBar
          authenticated={authd}
          onLogout={() => {
            authd = false;
          }}
        />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.queryByText('My account')).toBeInTheDocument()
    );
    await userEvent.click(screen.getByText('My account'));
    await userEvent.click(screen.getByText('Log out'));
    expect(removeToken).toHaveBeenCalled();
  });

  it('searches a query', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    await userEvent.type(screen.getByRole('textbox'), 'tasty recipe');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(mockedSetSearchParams).toHaveBeenCalled();
    expect(mockedSearchParams.set).toHaveBeenCalled()
    expect(mockedSetSearchParams).toHaveBeenCalledWith(mockedSearchParams);
    expect(mockedNavigate).toHaveBeenCalled();
  });

  it('removes category filtering when searching a query', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    await userEvent.type(screen.getByRole('textbox'), '            ');
    await userEvent.type(screen.getByRole('textbox'), 'tasty recipe');
    expect(mockedSearchParams.delete).toHaveBeenCalledWith('category');
    expect(mockedSearchParams.delete).toHaveBeenCalledWith('saved');
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  })
});
