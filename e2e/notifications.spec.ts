import { test, expect } from './fixtures';
import { logIn } from './utils';

test('receives notification', async ({
  page,
  mockNotificationSocket,
  mockRecipeCategories,
  mockRecipes,
  mockAuth,
}) => {
  await mockRecipeCategories();
  await mockRecipes();
  await mockAuth();
  await page.goto('/');

  const notifBadgeCount = page.locator('.MuiBadge-overlapRectangular');

  await logIn(page);

  await expect(page.getByText(/my account/i)).toBeVisible();
  await expect(notifBadgeCount).toBeHidden();
  await expect(page.locator('.MuiPaper-root')).toHaveCount(22);

  mockNotificationSocket.emit({
    id: 123,
    variant: 'RECIPE_EDIT',
    data: {
      recipeId: 42,
    },
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  await expect(page.locator('.MuiPaper-root')).toHaveCount(23);
  await expect(notifBadgeCount).toBeVisible();
});

test('marks notification as read', async ({
  page,
  mockAuth,
  mockRecipes,
  mockRecipeCategories,
  mockNotification,
  mockNotificationSocket,
  mockNotificationRead,
}) => {
  await mockAuth();
  await mockRecipeCategories();
  await mockRecipes();
  await mockNotification(false);
  await mockNotificationRead(1);

  await page.goto('/');

  await logIn(page);

  const notifBadgeCount = page.locator('.MuiBadge-overlapRectangular');
  const notifButton = page.getByRole('button', {
    name: 'notifications-button',
  });

  await expect(notifBadgeCount).toBeVisible();
  await expect(notifButton).toBeVisible();

  await notifButton.click();

  const notifs = page.getByRole('button', { name: 'notification-read-button' });

  await expect(page.getByText(/notifications/i)).toBeVisible();
  await expect(notifs).toHaveCount(2);

  await notifs.nth(1).click();

  await expect(notifBadgeCount).toBeHidden();
});
