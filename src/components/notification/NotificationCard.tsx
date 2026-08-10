import { Box, ButtonBase, Typography } from '@mui/material';
import {
  type Notification,
} from '@/services/notificationService';
import { useNotifications } from '@/context/NotificationContext';

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

  const { markAsRead } = useNotifications();

  const content = (
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
              bgcolor: 'background.paper',
            }
      }
    >
      <Typography variant="h6">{title}</Typography>
      <Typography>{description}</Typography>
    </Box>
  );

  return notification.isRead ? (
    content
  ) : (
    <ButtonBase
      component="div"
      onClick={async () => await markAsRead(notification.id)}
      sx={{ display: 'block', width: '100%' }}
    >
      {content}
    </ButtonBase>
  );
}
