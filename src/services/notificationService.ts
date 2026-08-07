import { httpService } from './httpService';

export type NotificationVariant = 'RECIPE_EDIT';

export interface Notification {
  id: number;
  variant: NotificationVariant;
  data: Record<string, unknown>;
  isRead: boolean;
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await httpService.get('/notifications');

  return response.data.notifications;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await httpService.post(`/notifications/${id}`);
}
