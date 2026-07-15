import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useRecipe } from '@/hooks/useRecipe';
import { RecipeDetailsCard } from '@/components/recipe/RecipeDetailsCard';
import { useBookmark } from '@/hooks/useBookmark';

export default function RecipeDetails() {
  const { id } = useParams();

  const recipeId = id ? Number(id) : undefined;

  const { recipe, setRecipe, loading, forbidden, error } = useRecipe(recipeId);
  const { toggleBookmark } = useBookmark({
    mode: 'single',
    state: { setRecipe },
  });

  if (loading) {
    return <Typography>Loading recipe...</Typography>;
  }

  if (forbidden) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'background.default',
          mt: 3,
        }}
      >
        <Typography variant="h2" sx={{ mt: 10, mb: 10 }}>
          The recipe does not exist
        </Typography>
      </Box>
    );
  }

  if (error || !recipe) {
    return <Typography>Unable to load recipe.</Typography>;
  }

  return (
    <RecipeDetailsCard recipe={recipe} onBookmarkToggle={toggleBookmark} />
  );
}
