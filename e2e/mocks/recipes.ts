import type { Page } from '@playwright/test';
import { mockGet, mockPost } from './api';
import {
  recipesResponse,
  categoriesResponse,
  breakfastRecipesResponse,
  recipeCreatedResponse,
  recipeDetailsResponse,
} from './data/recipes';

export async function mockRecipeCategories(page: Page) {
  await mockGet(page, '/recipes/categories', categoriesResponse);
}

export async function mockRecipes(page: Page) {
  await mockGet(page, '/recipes', (url) => {
    const category = url.searchParams.get('category');

    if (category === 'breakfasts') {
      return breakfastRecipesResponse;
    }

    return recipesResponse;
  });
}

export async function mockRecipeId(page: Page, id: number) {
  await mockGet(page, `/recipes/${id}`, () => {
    return {
      ...recipeDetailsResponse,
      id,
    };
  });
}

export async function mockRecipeCreate(page: Page, id?: number) {
  await mockPost(
    page,
    '/recipes',
    {
      ...recipeCreatedResponse,
      ...(id !== undefined && { id }),
    },
    201
  );
}

export async function mockImageUploadUrl(page: Page, id?: number) {
  await mockPost(page, `/recipes/${id ?? 1}/image-upload-url`, {
    url: 'url/to/image/upload',
    key: 'image/upload',
  });
}

export async function mockRateRecipe(page: Page, id: number) {
  await mockPost(page, `/recipes/${id}/rate`, {});
}
