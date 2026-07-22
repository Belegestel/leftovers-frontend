import { Box, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

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
  if (featured) {
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
          size="medium"
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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Typography sx={{ mt: 0.2 }}>
        {rating.toFixed(1)}
      </Typography>

      <StarIcon
        sx={{
          fontSize: 18,
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
