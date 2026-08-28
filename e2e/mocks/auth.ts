import type { Page } from '@playwright/test';
import { mockPost } from './api';

export async function mockRegister(page: Page) {
  await mockPost(page, '/auth/register', {
    message: 'Confirmation email sent.',
  });
}

export async function mockLogin(page: Page, successful?: boolean) {
  if (successful === undefined || successful === true) {
    await mockPost(page, '/auth/login', {
      refreshToken: 'rtoken',
      accessToken: 'atoken',
    });
  } else {
    await mockPost(
      page,
      '/auth/login',
      { message: 'Invalid credentials' },
      401
    );
  }
}

export async function mockResetPassword(page: Page) {
  await mockPost(page, '/auth/reset-password', { message: 'E-mail sent' });
}

export async function mockMe(page: Page) {
  await mockPost(page, '/auth/me', {
    refreshToken: 'rtoken',
    accessToken: 'atoken',
  });
}
