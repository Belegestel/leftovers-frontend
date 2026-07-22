import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface SaveRecipeButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
}

export function SaveRecipeButton({
  bookmarked,
  onToggle,
}: SaveRecipeButtonProps) {
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
      {bookmarked ? (
        <BookmarkIcon sx={{ color: 'primary.main' }} />
      ) : (
        <BookmarkBorderIcon sx={{ color: 'primary.main' }} />
      )}
    </IconButton>
  );
}
