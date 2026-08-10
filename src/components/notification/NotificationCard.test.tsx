import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { NotificationCard } from './NotificationCard';
import type { Notification } from '@/services/notificationService';

const mockedMarkAsRead = vi.fn();

vi.mock('@/context/NotificationContext', () => ({
  useNotifications: () => ({
    markAsRead: mockedMarkAsRead,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('NotificationCard', () => {
  const notification: Notification = {
    id: 42,
    variant: 'RECIPE_EDIT',
    data: {
      recipeTitle: 'Pizza',
    },
    isRead: false,
    createdAt: new Date(),
  };

  it('displays the notification title and description', () => {
    render(<NotificationCard notification={notification} />);

    expect(screen.getByText('New recipe edit!')).toBeInTheDocument();
    expect(
      screen.getByText('A recipe "Pizza" has changed!')
    ).toBeInTheDocument();
  });

  it('marks an unread notification as read when clicked', async () => {
    const user = userEvent.setup();

    render(<NotificationCard notification={notification} />);

    await user.click(screen.getByText('New recipe edit!'));

    expect(mockedMarkAsRead).toHaveBeenCalledWith(42);
  });

  it('does not mark an already-read notification as read', async () => {
    render(
      <NotificationCard
        notification={{
          ...notification,
          isRead: true,
        }}
      />
    );

    const button = screen.getByLabelText('notification-read-button');

    expect(button).toHaveStyle({ pointerEvents: 'none' });
  });

  it('does not allow interaction when already read', () => {
    render(
      <NotificationCard
        notification={{
          ...notification,
          isRead: true,
        }}
      />
    );

    const button = screen.getByLabelText('notification-read-button');

    expect(button).toHaveStyle({ pointerEvents: 'none' });
  });
});
