import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import {
  NotificationProvider,
  useNotifications,
} from './NotificationContext';
import { NotificationCard } from '@/components/notification/NotificationCard';
import type { Notification } from '@/services/notificationService';
import { useAuth } from './AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
} from '@/services/notificationService';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from '@/sockets/NotificationSocket';
import { getToken } from '@/services/tokenService';
import { useSnackbar } from '@/components/common/SnackbarProvider';

vi.mock('./AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/services/notificationService', () => ({
  getNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));

vi.mock('@/sockets/NotificationSocket', () => ({
  connectNotificationSocket: vi.fn(),
  disconnectNotificationSocket: vi.fn(),
}));

vi.mock('@/services/tokenService', () => ({
  getToken: vi.fn(),
}));

vi.mock('@/components/common/SnackbarProvider', () => ({
  useSnackbar: vi.fn(),
}));

const mockedShowSnackbar = vi.fn();

const mockedSocket = {
  on: vi.fn(),
};

const notifications: Notification[] = [
  {
    id: 1,
    variant: 'RECIPE_EDIT',
    data: {
      recipeTitle: 'Pizza',
    },
    isRead: false,
  },
  {
    id: 2,
    variant: 'RECIPE_EDIT',
    data: {
      recipeTitle: 'Pasta',
    },
    isRead: true,
  },
];

function NotificationList() {
  const { notifications } = useNotifications();

  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </>
  );
}

describe('NotificationProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      authenticated: true,
    } as ReturnType<typeof useAuth>);
    vi.mocked(getNotifications).mockResolvedValue(notifications);
    vi.mocked(markNotificationAsRead).mockResolvedValue(undefined);
    vi.mocked(getToken).mockReturnValue('test-token');
    vi.mocked(connectNotificationSocket).mockReturnValue(
      mockedSocket as any,
    );
    vi.mocked(useSnackbar).mockReturnValue(mockedShowSnackbar);
  });

  it('loads existing notifications when authenticated', async () => {
    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    expect(
      await screen.findByText('A recipe "Pizza" has changed!'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('A recipe "Pasta" has changed!'),
    ).toBeInTheDocument();

    expect(getNotifications).toHaveBeenCalled();
  });

  it('clears notifications when the user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      authenticated: false,
    } as ReturnType<typeof useAuth>);

    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    expect(
      screen.queryByText('A recipe "Pizza" has changed!'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText('A recipe "Pasta" has changed!'),
    ).not.toBeInTheDocument();

    expect(disconnectNotificationSocket).toHaveBeenCalled();
  });

  it('connects to the notification socket when authenticated', async () => {
    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    await waitFor(() => {
      expect(connectNotificationSocket).toHaveBeenCalledWith(
        'test-token',
      );
    });
  });

  it('displays a notification received from the socket', async () => {
    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    await waitFor(() => {
      expect(mockedSocket.on).toHaveBeenCalledWith(
        'notification',
        expect.any(Function),
      );
    });

    const notificationHandler = mockedSocket.on.mock.calls[0][1];

    act(() => notificationHandler({
      id: 3,
      variant: 'RECIPE_EDIT',
      data: {
        recipeTitle: 'Salad',
      },
      isRead: false,
    }));

    expect(
      await screen.findByText('A recipe "Salad" has changed!'),
    ).toBeInTheDocument();
  });

  it('shows a snackbar when a new notification arrives', async () => {
    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    await waitFor(() => {
      expect(mockedSocket.on).toHaveBeenCalledWith(
        'notification',
        expect.any(Function),
      );
    });

    const notificationHandler = mockedSocket.on.mock.calls[0][1];

    act(() => notificationHandler({
      id: 3,
      variant: 'RECIPE_EDIT',
      data: {
        recipeTitle: 'Salad',
      },
      isRead: false,
    }));

    expect(mockedShowSnackbar).toHaveBeenCalledWith({
      message: '🔔You have a new notification!🔔',
    });
  });

  it('marks a notification as read', async () => {
    const user = userEvent.setup();

    render(
      <NotificationProvider>
        <NotificationList/>
      </NotificationProvider>
    )

    const notification = await screen.findByText(
      'A recipe "Pizza" has changed!',
    );

    await user.click(notification);

    expect(markNotificationAsRead).toHaveBeenCalledWith(1);
  });
});
