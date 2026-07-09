import { beforeEach, describe, expect, it } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
} from './tokenService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a JWT token', () => {
    setToken('test-token');
    expect(getToken()).toBe('test-token');
  });

  it('removes a JWT token', () => {
    setToken('test-token');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('returns true when a token exists', () => {
    setToken('test-token');
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false when a token does not exist', () => {
    expect(isAuthenticated()).toBe(false);
  });
});
