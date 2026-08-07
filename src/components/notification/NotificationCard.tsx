import { Box, Typography } from '@mui/material';
import type { Notification } from '@/services/notificationService';

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const title =
    notification.variant === 'RECIPE_EDIT' ? 'New recipe edit!' : '';

  const description =
    notification.variant === 'RECIPE_EDIT'
      ? `A recipe "${notification.data.recipeTitle}" has changed!`
      : '';

  return (
    <Box
      sx={
        notification.isRead
          ? {
              pl: 2,
            }
          : {
              position: 'relative',
              pl: 2,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 8,
                bottom: 8,
                width: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }
      }
    >
      <Typography variant="h6">{title}</Typography>
      <Typography>{description}</Typography>
    </Box>
  );
}
