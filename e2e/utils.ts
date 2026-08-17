import { type Page } from '@playwright/test';

export async function logIn(page: Page) {
  await page.getByRole('button', { name: 'Log in' }).click();
  await page
    .getByRole('textbox', {
      name: 'E-mail address',
    })
    .fill('my@email.com');
  await page
    .getByRole('textbox', {
      name: 'Password',
    })
    .fill('my-password');
  await page.getByRole('button', { name: 'Log in' }).click();
}
