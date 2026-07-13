import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface SaveRecipeButtonProps {
  onSave: () => void;
}

export function SaveRecipeButton({ onSave }: SaveRecipeButtonProps) {
  return (
    <IconButton
      onClick={onSave}
      sx={{
        backgroundColor: 'white',
        width: 44,
        height: 44,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        '&:hover': {
          backgroundColor: 'white',
        },
      }}
    >
      <BookmarkBorderIcon color="secondary" />
    </IconButton>
  );
}
