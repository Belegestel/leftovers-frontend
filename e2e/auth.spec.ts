import { test, expect } from './fixtures';
import { logIn } from './utils';

test('user can register', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockRegister,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockRegister();

  await page.goto('/');

  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Create an account for free')).toBeVisible();

  const mailField = page.getByRole('textbox', {
    name: 'E-mail address',
  });
  const passwordField = page.getByRole('textbox', {
    name: 'Password',
  });
  const signUpButton = page.getByRole('button', { name: 'Create an account' });
  const tosCheckbox = page.getByRole('checkbox');
  await expect(mailField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(signUpButton).not.toBeEnabled();

  await mailField.fill('my@mail.com');
  await expect(signUpButton).not.toBeEnabled();
  await passwordField.fill('my-password');
  await expect(signUpButton).not.toBeEnabled();
  await tosCheckbox.check();
  await expect(signUpButton).toBeEnabled();
  await signUpButton.click();
});

test('user can log in', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockLogin,
  mockMe,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockLogin();
  await mockMe();

  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();

  const mailField = page.getByRole('textbox', {
    name: 'E-mail address',
  });
  const passwordField = page.getByRole('textbox', {
    name: 'Password',
  });
  const loginButton = page.getByRole('button', { name: 'Log in' });

  await expect(mailField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();
  await expect(loginButton).not.toBeEnabled();

  await mailField.fill('my@mail.com');
  await expect(loginButton).not.toBeEnabled();
  await passwordField.fill('my-password');
  await expect(loginButton).toBeEnabled();

  await loginButton.click();
});

test('user can navigate between signup and login', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
}) => {
  await mockRecipes();
  await mockRecipeCategories();

  page.goto('/');

  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText('Create an account for free')).toBeVisible();
  const loginLink = page.getByText('Login');
  await expect(loginLink).toBeVisible();

  await loginLink.click();

  await expect(page.getByText('Create an account for free')).not.toBeVisible();
  await expect(loginLink).not.toBeVisible();

  const loginButton = page.getByRole('button', { name: 'Log in' });
  const signupLabel = page.getByText("Don't have an account yet?");
  const signupLink = page.getByText('Create an account');
  await expect(signupLabel).toBeVisible();
  await expect(loginButton).toBeVisible();
  await expect(signupLink).toBeVisible();

  await signupLink.click();

  await expect(loginButton).not.toBeVisible();
  await expect(signupLabel).not.toBeVisible();

  await expect(page.getByText('Create an account for free')).toBeVisible();
  await expect(loginLink).toBeVisible();
});

test('user can request a password reset', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockResetPassword,
}) => {
  await mockRecipes();
  await mockRecipeCategories();
  await mockResetPassword();

  await page.goto('/');

  await page.getByRole('button', { name: 'Log in' }).click();

  const forgotPasswordLink = page.getByText('Forgot your password?');

  await expect(forgotPasswordLink).toBeVisible();
  await forgotPasswordLink.click();

  await expect(forgotPasswordLink).not.toBeVisible();
  await expect(page.getByText('Forgot password')).toBeVisible();

  const emailField = page.getByRole('textbox', {
    name: 'E-mail address',
  });

  await expect(emailField).toBeVisible();
  await emailField.fill('my@mail.com');

  await page.getByRole('button', { name: 'Send e-mail' }).click();
});

test('navbar changes for a logged in user', async ({
  page,
  mockRecipeCategories,
  mockRecipes,
  mockLogin,
  mockMe,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockLogin();
  await mockMe();

  await page.goto('/');

  const loginButton = page.getByRole('button', {name: 'Log in'});

  await logIn(page);

  await expect(loginButton).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add recipe' })).toBeVisible();
});
