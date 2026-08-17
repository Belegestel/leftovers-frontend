import { test, expect } from './fixtures';
import { mockRecipeCategories } from './mocks/recipes';
import { logIn } from './utils';

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

test('user can create recipe', async ({
  page,
  mockAuth,
  mockRecipeCategories,
  mockRecipes,
  mockImageUploadUrl,
  mockRecipesCreate,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockAuth();
  await mockImageUploadUrl(1);
  await mockRecipesCreate(1);
  page.goto('/');
  await logIn(page);

  const recipeCreateNavButton = page.getByRole('button', {
    name: 'Add recipe',
  });
  await recipeCreateNavButton.click();

  const nextPageButton = page.getByRole('button', { name: /next/i });

  await expect(page.getByText('Add recipe')).toHaveCount(2);

  await expect(nextPageButton).not.toBeEnabled();
  const imageBox = page.locator('input[type=file]');
  await imageBox.setInputFiles('e2e/fixtures/pizza.jpg');
  await page.getByRole('textbox', { name: 'Title' }).fill('Pizza');
  await page.getByRole('textbox', { name: 'Description' }).fill('Tasty pizza');
  await expect(nextPageButton).not.toBeEnabled();
  await page.locator('#mui-component-select-category').click();
  await page.getByRole('option', { name: 'Breakfast' }).click();
  await expect(nextPageButton).toBeEnabled();
  await nextPageButton.click();

  await expect(nextPageButton).not.toBeEnabled();
  await expect(page.getByRole('button', { name: /back/i })).toBeEnabled();
  await page
    .getByRole('textbox', { name: 'Ingredient #1' })
    .fill('Ingredient 1');
  await page
    .getByRole('textbox', { name: 'Ingredient #2' })
    .fill('Ingredient 2');
  await page
    .getByRole('textbox', { name: 'Ingredient #3' })
    .fill('Ingredient 3');
  await expect(nextPageButton).toBeEnabled();
  await page.getByRole('button', { name: 'Add a new ingredient' }).click();
  await expect(nextPageButton).not.toBeEnabled();
  await page
    .getByRole('textbox', { name: 'Ingredient #4' })
    .fill('Ingredient 4');
  await expect(nextPageButton).toBeEnabled();
  const removeIngredientButtons = page
    .getByRole('button')
    .filter({ hasText: /^$/ });
  await removeIngredientButtons.nth(3).click();
  await expect(removeIngredientButtons).toHaveCount(1);
  await nextPageButton.click();

  await expect(page.getByText('Enter preparation method')).toBeVisible();

  await expect(nextPageButton).not.toBeEnabled();
  await expect(page.getByRole('button', { name: /back/i })).toBeEnabled();
  await page.getByRole('textbox', { name: 'Step 1' }).fill('Step 1');
  await page.getByRole('textbox', { name: 'Step 2' }).fill('Step 2');
  await page.getByRole('textbox', { name: 'Step 3' }).fill('Step 3');
  await page.getByRole('button', { name: 'Add a new step' }).click();
  await page.getByRole('textbox', { name: 'Step 4' }).fill('Step 4');
  await removeIngredientButtons.nth(3).click();
  await expect(removeIngredientButtons).toHaveCount(1);
  await nextPageButton.click();

  await expect(nextPageButton).not.toBeVisible();
  const savePrivateButton = page.getByRole('button', { name: /private/i });
  const savePublicButton = page.getByRole('button', { name: /publish/i });
  const deleteButton = page.getByRole('button', { name: /delete/i });
  await expect(savePrivateButton).toBeEnabled();
  await expect(savePublicButton).toBeEnabled();
  await expect(deleteButton).toBeEnabled();
  await savePrivateButton.click();
});

test('user can edit recipe', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockAuth,
  mockRecipeId,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockAuth();
  await mockRecipeId(3);

  await page.goto('/');

  await logIn(page);

  await page.goto('/my-recipes');

  await expect(page.getByText('My Recipes')).toBeVisible();
  await expect(page.getByText('Edit the recipe').nth(0)).toBeVisible();
});

test('user can rate the recipe', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockRecipeId,
  mockRateRecipe,
  mockAuth,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockRecipeId(3);
  await mockRateRecipe(3);
  await mockAuth();

  await page.goto('/');

  await page.getByText('Pizza').nth(2).click();

  const rateButton = page.getByRole('button', { name: 'Rate the recipe' });
  await expect(rateButton).toBeVisible();
  await rateButton.click();

  await expect(page.getByText('Login to rate the recipe')).toBeVisible();

  await page.getByRole('button', { name: 'cancel' }).click();

  await logIn(page);
  await rateButton.click();

  await expect(page.getByText('How would you rate this recipe')).toBeVisible();

  const thirdStar = page.locator('label').filter({ hasText: '3 Stars' });
  await expect(thirdStar).toBeVisible();
  await thirdStar.click();
  await page.getByRole('button', { name: 'submit' }).click();
});
