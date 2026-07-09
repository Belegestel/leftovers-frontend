import { beforeEach, describe, expect, it } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
} from './tokenService';

describe('tokenService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a JWT token', () => {
    setToken('test-token', false);
    expect(getToken()).toBe('test-token');
  });

  it('removes a JWT token', () => {
    setToken('test-token', false);
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('returns true when a token exists', () => {
    setToken('test-token', false);
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false when a token does not exist', () => {
    removeToken()
    expect(isAuthenticated()).toBe(false);
  });
});
