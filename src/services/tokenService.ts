const TOKEN_KEY = "jwt";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, rememberMe: boolean) {
  removeToken();

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function getRefreshToken() {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ??
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}

export function setRefreshToken(token: string, rememberMe: boolean) {
  removeRefreshToken();

  if (rememberMe) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  removeToken();
  removeRefreshToken();
}

export function isAuthenticated() {
  const token = getToken();

  if (!token) {
    return false;
  }

  return token.trim().length > 0;
}

export function updateTokens(accessToken: string, refreshToken: string) {
  const rememberMe = localStorage.getItem(REFRESH_TOKEN_KEY) !== null;

  setToken(accessToken, rememberMe);
  setRefreshToken(refreshToken, rememberMe);
}
