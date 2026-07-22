import { createContext, useContext, useEffect, useState } from 'react';
import { httpService } from '@/services/httpService';
import { getToken, removeToken } from '@/services/tokenService';

type AuthContextType = {
  authVersion: number;
  authChanged: () => void;
  authenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authVersion, setAuthVersion] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    const token = getToken();

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await httpService.post('/auth/me');
      setAuthenticated(true);
    } catch {
      removeToken();
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  function authChanged() {
    setAuthVersion((previous) => previous + 1);
    checkAuth();
  }

  return (
    <AuthContext.Provider
      value={{
        authVersion,
        authChanged,
        authenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
