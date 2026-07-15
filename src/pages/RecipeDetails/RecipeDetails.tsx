import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useRecipe } from '@/hooks/useRecipe';
import { RecipeDetailsCard } from '@/components/recipe/RecipeDetailsCard';
import { useRecipeBookmark } from '@/hooks/useRecipeBookmark';

export default function RecipeDetails() {
  const { id } = useParams();

  const recipeId = id ? Number(id) : undefined;

  const { recipe, setRecipe, loading, error } = useRecipe(recipeId);
  const { toggleBookmark } = useRecipeBookmark(recipe, setRecipe);

  if (loading) {
    return <Typography>Loading recipe...</Typography>;
  }

  if (error || !recipe) {
    return <Typography>Unable to load recipe.</Typography>;
  }

  return (
    <RecipeDetailsCard recipe={recipe} onBookmarkToggle={toggleBookmark} />
  );
}
