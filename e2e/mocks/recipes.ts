import type { Page } from '@playwright/test';
import { mockGet } from './api';
import {
  recipesResponse,
  categoriesResponse,
  breakfastRecipesResponse,
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
