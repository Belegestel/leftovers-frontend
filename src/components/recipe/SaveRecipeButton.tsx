import { Button, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useTranslation } from 'react-i18next';

interface SaveRecipeButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
  variant?: 'icon' | 'button';
}

export function SaveRecipeButton({
  bookmarked,
  onToggle,
  variant = 'icon',
}: SaveRecipeButtonProps) {
  const { t } = useTranslation();
  const icon = bookmarked ? (
    <BookmarkIcon sx={{ color: 'primary.main' }} />
  ) : (
    <BookmarkBorderIcon sx={{ color: 'primary.main' }} />
  );

  if (variant === 'button') {
    return (
      <Button
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        startIcon={icon}
        variant="outlined"
        sx={{
          '&:hover': {
            boxShadow: 3,
          },
          '&:hover svg': {
            transform: 'rotate(15deg) scale(1.1)',
          },
          '& svg': {
            transition: 'transform 100ms ease',
          },
        }}
        aria-label="bookmark"
      >
        {t('recipeCard.save')}
      </Button>
    );
  }

  return (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      sx={{
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: 'grey.100',
          transform: 'rotate(15deg) scale(1.1)',
        },
        transition: 'transform 150ms ease',
      }}
      aria-label="bookmark"
    >
      {icon}
    </IconButton>
  );
}
