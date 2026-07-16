import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/services/httpService', () => ({
  httpService: {
    post: vi.fn(),
  },
}));

vi.mock('@/services/tokenService', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

import { httpService } from '@/services/httpService';
import { getToken, removeToken } from '@/services/tokenService';

const mockedHttp = vi.mocked(httpService.post);
const mockedGetToken = vi.mocked(getToken);
const mockedRemoveToken = vi.mocked(removeToken);

function TestComponent() {
  const { authenticated, loading } = useAuth();

  return (
    <>
      <span>{authenticated ? 'yes' : 'no'}</span>
      <span>{loading ? 'loading' : 'done'}</span>
    </>
  );
}

describe('AuthProvider', () => {
  it('authenticates when /auth/me succeeds', async () => {
    mockedGetToken.mockReturnValue('valid-token');
    mockedHttp.mockResolvedValue({});

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('yes')).toBeInTheDocument();
    });
  });

  it('removes token when /auth/me fails', async () => {
    mockedGetToken.mockReturnValue('bad-token');
    mockedHttp.mockRejectedValue(new Error());

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('no')).toBeInTheDocument();
    });

    expect(mockedRemoveToken).toHaveBeenCalled();
  });
});
