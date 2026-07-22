import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  authVersion: number;
  authChanged: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authVersion, setAuthVersion] = useState(0);

  function authChanged() {
    setAuthVersion((previous) => previous + 1);
  }

  return (
    <AuthContext.Provider
      value={{
        authVersion,
        authChanged,
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
