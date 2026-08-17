import { test, expect } from './fixtures';

test('user can open the recipes page', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
}) => {
  await mockRecipeCategories();
  await mockRecipes();

  await page.goto('/');

  await page.getByRole('button', { name: 'Recipes' }).click();

  await expect(page.getByText('Pizza')).toHaveCount(4);
});

test('user can filter recipes by category', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
}) => {
  await mockRecipeCategories();
  await mockRecipes();

  await page.goto('/recipes');

  await expect(page.getByText('Pizza')).toHaveCount(2);

  await page.getByRole('button', { name: /Filters/i }).click();

  await page.getByRole('checkbox', { name: /Breakfasts/i }).check();

  await expect(page.getByText('Breakfast Pancakes')).toBeVisible();
  await expect(page.getByText('Pizza')).toHaveCount(0);
});
