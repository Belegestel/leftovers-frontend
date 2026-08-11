import { describe, expect, it, vi } from 'vitest';
import { getBrowserLanguage } from './browserLanguage';

describe('getBrowserLanguage', () => {
  it('returns the first supported browser language', () => {
    vi.stubGlobal('navigator', {
      languages: ['de-DE', 'fr-FR'],
      language: 'de-DE',
    });

    expect(getBrowserLanguage()).toBe('de');
  });

  it('falls back to null for unsupported languages', () => {
    vi.stubGlobal('navigator', {
      languages: ['es-ES'],
      language: 'es-ES',
    });

    expect(getBrowserLanguage()).toBe(null);
  });
});
