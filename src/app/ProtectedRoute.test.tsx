import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, expect, it } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/context/AuthContext';

const mockedUseAuth = vi.mocked(useAuth);

describe('ProtectedRoute', () => {
  it('renders nothing while loading', () => {
    mockedUseAuth.mockReturnValue({
      authenticated: false,
      loading: true,
      authVersion: 0,
      authChanged: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('redirects unauthenticated users', () => {
    mockedUseAuth.mockReturnValue({
      authenticated: false,
      loading: false,
      authVersion: 0,
      authChanged: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/saved']}>
        <ProtectedRoute />
      </MemoryRouter>
    );

    expect(screen.queryByText('saved')).not.toBeInTheDocument();
  });


it('renders protected content when authenticated', () => {
  mockedUseAuth.mockReturnValue({
    authenticated: true,
    loading: false,
    authVersion: 0,
    authChanged: vi.fn(),
  });

  render(
    <MemoryRouter initialEntries={['/saved']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/saved" element={<div>Saved page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Saved page')).toBeInTheDocument();
});
});
