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

        '&:hover .dateField': {
          transform: 'scale(1.2)',
        },
        '& .dateField': {
          transition: 'transform 150ms ease',
        },
        '&:hover ::before': {
          ...(!notification.isRead && {
            top: 4,
            bottom: 4,
            width: 8,
          }),
        },
        '& ::before': {
          transition: 'top 150ms ease, bottom 150ms ease, width 150ms ease',
        },
        '&:hover p': {
          transform: 'translateX(4px)',
        },
        '& p': {
          transition: 'transform 150ms ease',
        },
        '&:hover h6': {
          transform: 'translateX(4px)',
        },
        '& h6': {
          transition: 'transform 150ms ease',
        },
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
          className="dateField"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: 12,
            color: 'text.secondary',
            transformOrigin: 'top right',
          }}
        >
          {date}
        </Typography>
      </Box>
    </ButtonBase>
  );
}
