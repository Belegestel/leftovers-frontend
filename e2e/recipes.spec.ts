import { test, expect } from './fixtures';
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

test('more recipes load after scrolling down', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
}) => {
  await mockRecipeCategories();
  await mockRecipes();

  const scrollToBottom = async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  };

  await page.goto('/');

  const recipeCards = page.locator('.MuiGrid-root > .MuiPaper-root');
  await expect(recipeCards).toHaveCount(20);

  const scrollingEnd = page.getByText('No more recipes');
  await expect(scrollingEnd).not.toBeVisible();

  const page1Response = page.waitForResponse(/\page=1/i);
  await scrollToBottom();
  await page1Response;
  await expect(scrollingEnd).not.toBeVisible();
  await expect(recipeCards).toHaveCount(40);

  const page2Response = page.waitForResponse(/\page=2/i);
  await scrollToBottom();
  await page2Response;
  await expect(recipeCards).toHaveCount(50);

  await scrollToBottom();
  await expect(scrollingEnd).toBeVisible();
});

test('user sees recipe suggestions when searching', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockRecipeSuggestions,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockRecipeSuggestions();

  await page.goto('/');

  const pizzaLocator = page.getByText('Pizza');

  const textInput = page.getByRole('combobox');
  await expect(textInput).toBeVisible();
  const pizzaCount = await pizzaLocator.count();

  const suggestionsResponse = page.waitForResponse(/\/recipes\/suggestions/i);
  await textInput.fill('Piz');

  await suggestionsResponse;

  await expect(pizzaLocator).toHaveCount(pizzaCount + 1);
});

test('user can search for recipes', async ({
  page,
  mockRecipeSuggestions,
  mockRecipes,
  mockRecipeCategories,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockRecipeSuggestions();

  await page.goto('/');

  const textInput = page.getByRole('combobox');
  await expect(textInput).toBeVisible();

  await textInput.fill('Pizz');
  await textInput.press('Enter');

  await expect(page.getByText('Search results for')).toBeVisible();
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(8);
  await expect(page.getByRole('heading', { name: 'Pizza' })).toBeVisible();
});

test('user can order the recipes', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
}) => {
  await mockRecipeCategories();
  await mockRecipes();

  await page.goto('/recipes');

  await expect(page.getByText('All recipes')).toBeVisible();

  const filtersButton = page.getByRole('button', { name: 'Filters' });
  const ratingButton = page.getByRole('button', { name: 'Rating' });
  const dateButton = page.getByRole('button', { name: 'Date' });

  await expect(filtersButton).toBeVisible();
  await expect(ratingButton).toBeVisible();
  await expect(dateButton).toBeVisible();

  await filtersButton.click();
  const options = page.locator('label');
  await expect(options).toHaveCount(10);
  const breakfastsResponse = page.waitForResponse(/category=breakfasts/);
  await options.first().click();
  await breakfastsResponse;
  await page.keyboard.press('Escape');
  await expect(options).toHaveCount(0);

  await ratingButton.click();
  await expect(options).toHaveCount(2);
  const ratingResponse = page.waitForResponse(/ratingOrderIncr=true/i);
  await options.nth(1).click();
  await ratingResponse;
  await page.keyboard.press('Escape');
  await expect(options).toHaveCount(0);

  await dateButton.click();
  await expect(options).toHaveCount(2);
  const dateResponse = page.waitForResponse(/ratingOrderIncr=true/i);
  await options.first().click();
  await dateResponse;
  await page.keyboard.press('Escape');
  await expect(options).toHaveCount(0);

  await expect(page.getByText('Breakfast Pancakes')).toBeVisible()
  await expect(page.getByText('Pizza')).not.toBeVisible()
});
