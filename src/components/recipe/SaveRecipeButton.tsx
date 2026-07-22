import { Button, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
      >
        Save
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
        },
      }}
    >
      {icon}
    </IconButton>
  );
}
