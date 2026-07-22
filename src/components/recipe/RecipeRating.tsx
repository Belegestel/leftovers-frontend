import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RecipeRatingProps {
  rating: number;
  ratingCount: number;
  featured?: boolean;
}

export function RecipeRating({ rating, ratingCount, featured = false }: RecipeRatingProps) {
  const stars = Math.round(rating);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Typography sx={{mt: 0.4}}>{stars}.0</Typography>
      {featured ? (
        Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            sx={{
              color: index < stars ? 'rating.main' : 'grey.300',
            }}
          />
        ))
      ) : (
        <StarIcon
          sx={{
            color: 'rating.main',
          }}
        />
      )}

      <Typography variant="body2" color="text.secondary">
        ({ratingCount})
      </Typography>
    </Box>
  );
}
