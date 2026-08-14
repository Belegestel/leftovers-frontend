import { test as base } from '@playwright/test';
import { mockApi } from './mocks/api';
import { mockRecipeCategories, mockRecipes } from './mocks/recipes';

type Fixtures = {
  mockRecipeCategories: () => Promise<void>;
  mockRecipes: () => Promise<void>;
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
});

export { expect } from '@playwright/test';
