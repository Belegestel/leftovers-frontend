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
const mockedSearchParams = new URLSearchParams();
const mockedNotificationContext = vi.hoisted(() => ({
  notifications: [
    {
      id: 1,
      variant: 'RECIPE_EDIT' as const,
      data: { recipeTitle: 'Pizza' },
      isRead: false,
      createdAt: new Date(),
    },
    {
      id: 2,
      variant: 'RECIPE_EDIT' as const,
      data: { recipeTitle: 'Pasta' },
      isRead: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      variant: 'RECIPE_EDIT' as const,
      data: { recipeTitle: 'Salad' },
      isRead: false,
      createdAt: new Date(),
    },
  ],
}));
vi.mock('@/context/NotificationContext', () => ({
  useNotifications: () => mockedNotificationContext,
}));
vi.mock('@/services/tokenService', () => ({
  isAuthenticated: vi.fn(),
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
  useParams: () => ({ lang: 'en' }),
  useSearchParams: () => [mockedSearchParams, mockedSetSearchParams],
}));
vi.mock('@/hooks/useRecipeCategories', () => ({
  useRecipeCategories: () => ({
    categories: [{ name: 'All categories' }, { name: 'breakfast' }],
    loading: false,
  }),
}));
vi.mock('@/hooks/useRecipeSuggestions', () => ({
  useRecipeSuggestions: () => ({
    suggestions: {
      names: ['Tasty recipe', 'Another recipe'],
    },
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

    const user = userEvent.setup();

    await user.type(screen.getByRole('combobox'), 'tasty recipe');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedSetSearchParams).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith(
      '/en/recipes?search=tasty+recipe',
      undefined
    );
  });

  it('removes category filtering when searching a query', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    const user = userEvent.setup();
    const searchInput = screen.getByRole('combobox');
    await user.type(searchInput, 'tasty recipe');

    expect(mockedSetSearchParams).toHaveBeenCalled();
    const params = mockedSetSearchParams.mock.calls.at(-1)?.[0];
    expect(params.get('category')).toBeNull();
    expect(params.get('saved')).toBeNull();
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('shows the number of unread notifications when authenticated', () => {
    render(
      <AuthProvider>
        <NavBar authenticated={true} onLogout={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not show notifications when logged out', () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );
    expect(
      screen.queryByRole('button', { name: /notifications-button/i })
    ).not.toBeInTheDocument();
  });

  it('shows autocomplete suggestions when searching', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('combobox');

    await user.type(textbox, 'tasty');

    expect(screen.getByText('Tasty recipe')).toBeInTheDocument();
    expect(screen.getByText('Another recipe')).toBeInTheDocument();
  });

  it('opens the notifications popover', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <NavBar authenticated={true} onLogout={() => {}} />
      </AuthProvider>
    );

    await user.click(
      screen.getByRole('button', { name: /notifications-button/i })
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays notifications in the notifications popover', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <NavBar authenticated={true} onLogout={() => {}} />
      </AuthProvider>
    );

    await user.click(
      screen.getByRole('button', { name: /notifications-button/i })
    );

    screen
      .getAllByText('New recipe edit!')
      .map((component) => expect(component).toBeDefined());
    screen
      .getAllByText('A recipe "Pizza" has changed!')
      .map((component) => expect(component).toBeDefined());
    screen
      .getAllByText('A recipe "Salad" has changed!')
      .map((component) => expect(component).toBeDefined());
  });

  it('searches when an autocomplete suggestion is selected', async () => {
    render(
      <AuthProvider>
        <NavBar authenticated={false} onLogout={() => {}} />
      </AuthProvider>
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('combobox');

    await user.type(textbox, 'tasty');
    await user.click(screen.getByText('Tasty recipe'));

    expect(mockedNavigate).toHaveBeenCalledWith(
      expect.stringContaining('/recipes?'),
      undefined
    );
    expect(mockedNavigate).toHaveBeenCalledWith(
      expect.stringContaining('search=Tasty+recipe'),
      undefined
    );
  });
});
