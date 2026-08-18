import { Box, ButtonBase, Typography } from '@mui/material';
import { type Notification } from '@/services/notificationService';
import { useNotifications } from '@/context/NotificationContext';
import { useTranslation } from 'react-i18next';

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { t } = useTranslation();

  const title =
    notification.variant === 'RECIPE_EDIT'
      ? t('notification.recipeEdit.title')
      : '';

  const description =
    notification.variant === 'RECIPE_EDIT'
      ? t('notification.recipeEdit.description', {
          recipeTitle: notification.data.recipeTitle,
        })
      : '';

  const date = notification.createdAt.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const { markAsRead } = useNotifications();

  return (
    <ButtonBase
      aria-label="notification-read-button"
      component="div"
      onClick={async () => await markAsRead(notification.id)}
      sx={{
        display: 'block',
        width: '100%',
        ...(notification.isRead && { pointerEvents: 'none' }),
      }}
    >
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
        <Typography
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: 12,
            color: 'text.secondary',
          }}
        >
          {date}
        </Typography>
      </Box>
    </ButtonBase>
  );
}
