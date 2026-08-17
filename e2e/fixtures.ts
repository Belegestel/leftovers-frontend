import { test as base } from '@playwright/test';
import { mockApi } from './mocks/api';
import { mockRecipeCategories, mockRecipes } from './mocks/recipes';
import {
  mockLogin,
  mockMe,
  mockRegister,
  mockResetPassword,
} from './mocks/auth';

type Fixtures = {
  mockRecipeCategories: () => Promise<void>;
  mockRecipes: () => Promise<void>;

  mockAuth: () => Promise<[void, void, void, void]>;
  mockRegister: () => Promise<void>;
  mockLogin: (successful?: boolean) => Promise<void>;
  mockResetPassword: () => Promise<void>;
  mockMe: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await mockApi(page);
    await use(page);
  },

  mockRecipeCategories: async ({ page }, use) => {
    await use(() => mockRecipeCategories(page));
  },

  mockRecipes: async ({ page }, use) => {
    await use(() => mockRecipes(page));
  },

  mockRegister: async ({ page }, use) => {
    await use(() => mockRegister(page));
  },

  mockLogin: async ({ page }, use) => {
    await use((successful?: boolean) => mockLogin(page, successful));
  },

  mockResetPassword: async ({ page }, use) => {
    await use(() => mockResetPassword(page));
  },

  mockMe: async ({ page }, use) => {
    await use(() => mockMe(page));
  },

  mockAuth: async ({ page }, use) => {
    await use(() =>
      Promise.all([
        mockRegister(page),
        mockLogin(page),
        mockResetPassword(page),
        mockMe(page),
      ])
    );
  },
});

export { expect } from '@playwright/test';
