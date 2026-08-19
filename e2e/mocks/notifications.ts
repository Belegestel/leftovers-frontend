import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Page } from '@playwright/test';
import { mockGet, mockPost } from './api';

const SOCKET_PORT = 9876;

export type MockNotification = {
  id: number;
  variant: 'RECIPE_EDIT';
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
};

export function createMockNotificationSocket() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  return {
    start: () =>
      new Promise<void>((resolve) => {
        httpServer.listen(SOCKET_PORT, '127.0.0.1', resolve);
      }),

    emit: (notification: MockNotification) => {
      io.emit('notification', notification);
    },

    stop: () =>
      new Promise<void>((resolve) => {
        io.close(() => resolve());
      }),
  };
}

export async function mockNotification(
  page: Page,
  allRead = true,
) {
  await mockGet(page, '/notifications', {
    notifications: [
      {
        id: 2,
        variant: 'RECIPE_EDIT',
        data: { recipeTitle: 'My Tasty Recipe' },
        isRead: true,
        createdAt: '2026-08-07T11:44:12.972Z',
      },
      {
        id: 1,
        variant: 'RECIPE_EDIT',
        data: { recipeTitle: 'My Tasty Recipe' },
        isRead: allRead,
        createdAt: '2026-08-07T11:25:39.752Z',
      },
    ],
  });
}

export async function mockNotificationRead(
  page: Page,
  id: number
) {
  await mockPost(page, `/notifications/${id}`, {})
}
