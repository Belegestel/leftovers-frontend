import { test, expect } from './fixtures';

test('navbar changes to a narrow version when the screen is not wide', async ({ page, mockRecipes, mockRecipeCategories }) => {
  await mockRecipeCategories();
  await mockRecipes();

  await page.goto('/');

  await page.setViewportSize({ width: 1280, height: 800 });

  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

  await page.setViewportSize({ width: 500, height: 800 });

  await expect(page.getByTestId('MenuIcon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Log in' })).not.toBeVisible();

  await page.setViewportSize({ width: 1280, height: 800 });

  await expect(page.getByTestId('MenuIcon')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});
