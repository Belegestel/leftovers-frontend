import { test as base } from '@playwright/test';
import { mockApi } from './mocks/api';
import {
  mockImageUploadUrl,
  mockRateRecipe,
  mockRecipeCategories,
  mockRecipeCreate,
  mockRecipeDelete,
  mockRecipeEdit,
  mockRecipeId,
  mockRecipes,
  mockSuggestions,
} from './mocks/recipes';
import {
  mockLogin,
  mockMe,
  mockRegister,
  mockResetPassword,
} from './mocks/auth';
import {
  createMockNotificationSocket,
  mockNotification,
  mockNotificationRead,
} from './mocks/notifications';

type Fixtures = {
  mockRecipeCategories: () => Promise<void>;
  mockRecipes: () => Promise<void>;
  mockImageUploadUrl: (id?: number) => Promise<void>;
  mockRecipesCreate: (id?: number) => Promise<void>;
  mockRecipeId: (id: number) => Promise<void>;
  mockRateRecipe: (id: number) => Promise<void>;
  mockRecipeSuggestions: () => Promise<void>;
  mockRecipeEdit: (id: number) => Promise<void>;
  mockRecipeDelete: (id: number) => Promise<void>;

  mockAuth: () => Promise<[void, void, void, void, void]>;
  mockRegister: () => Promise<void>;
  mockLogin: (successful?: boolean) => Promise<void>;
  mockResetPassword: () => Promise<void>;
  mockMe: () => Promise<void>;

  mockNotificationSocket: ReturnType<typeof createMockNotificationSocket>;
  mockNotification: (allRead?: boolean) => Promise<void>;
  mockNotificationRead: (id: number) => Promise<void>;
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

  mockImageUploadUrl: async ({ page }, use) => {
    await use((id?: number) => mockImageUploadUrl(page, id));
  },

  mockRecipesCreate: async ({ page }, use) => {
    await use((id?: number) => mockRecipeCreate(page, id));
  },

  mockRecipeId: async ({ page }, use) => {
    await use((id: number) => mockRecipeId(page, id));
  },

  mockRateRecipe: async ({ page }, use) => {
    await use((id: number) => mockRateRecipe(page, id));
  },

  mockRecipeSuggestions: async ({ page }, use) => {
    await use(() => mockSuggestions(page));
  },

  mockRecipeEdit: async ({ page }, use) => {
    await use((id: number) => mockRecipeEdit(page, id));
  },

  mockRecipeDelete: async ({ page }, use) => {
    await use((id: number) => mockRecipeDelete(page, id));
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
        mockNotification(page),
      ])
    );
  },

  mockNotification: async ({ page }, use) => {
    await use((allRead?: boolean) => mockNotification(page, allRead));
  },

  mockNotificationSocket: async ({}, use) => {
    const socket = createMockNotificationSocket();

    await socket.start();
    await use(socket);
    await socket.stop();
  },

  mockNotificationRead: async ({ page }, use) => {
    await use((id: number) => mockNotificationRead(page, id));
  },
});

export { expect } from '@playwright/test';
