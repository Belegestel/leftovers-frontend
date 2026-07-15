import { Box, Rating, Typography } from '@mui/material';

interface RecipeRatingProps {
  rating: number;
  ratingCount: number;
  featured?: boolean;
}

export function RecipeRating({
  rating,
  ratingCount,
  featured = false,
}: RecipeRatingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Typography sx={{ mt: 0.4 }}>
        {rating.toFixed(1)}
      </Typography>

      <Rating
        value={rating}
        readOnly
        precision={0.5}
        size={featured ? 'medium' : 'small'}
        sx={{
          color: 'rating.main',
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        ({ratingCount})
      </Typography>
    </Box>
  );
}
