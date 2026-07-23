import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import en from '../i18n/locales/en.json';

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: Record<string, any>) => {
        let value = getNestedValue(en, key) ?? key;

        if (options) {
          Object.entries(options).forEach(([key, val]) => {
            value = value.replace(`{{${key}}}`, String(val));
          });
        }

        return value;
      },
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  };
});
beforeEach(() => {
  vi.resetAllMocks();
});
