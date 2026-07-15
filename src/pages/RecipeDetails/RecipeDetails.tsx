import { Box, Typography } from '@mui/material';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecipe } from '@/hooks/useRecipe';
import { RecipeDetailsCard } from '@/components/recipe/RecipeDetailsCard';
import { useBookmark } from '@/hooks/useBookmark';
import { isAuthenticated } from '@/services/tokenService';
import { RateRecipeModal } from '@/components/recipe/RateRecipeModal';

export default function RecipeDetails() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const recipeId = id ? Number(id) : undefined;

  const { recipe, setRecipe, loading, forbidden, error, reloadRecipe } = useRecipe(recipeId);

  const { toggleBookmark } = useBookmark({
    mode: 'single',
    state: { setRecipe },
  });

  const rateModalOpen = searchParams.get('rate') === 'true';

  function handleRateClick() {
    navigate({
      pathname: location.pathname,
      search: isAuthenticated() ? '?rate=true' : '?rateLogin=true',
    });
  }

  function handleRateClose() {
    navigate(location.pathname, { replace: true });
  }

  async function handleRated() {
    await reloadRecipe();
  }

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
        <Typography
          variant="h2"
          sx={{
            mt: 10,
            mb: 10,
          }}
        >
          The recipe does not exist
        </Typography>
      </Box>
    );
  }

  if (error || !recipe) {
    return <Typography>Unable to load recipe.</Typography>;
  }

  return (
    <>
      <RecipeDetailsCard
        recipe={recipe}
        onBookmarkToggle={toggleBookmark}
        onRate={handleRateClick}
      />

      <RateRecipeModal
        open={rateModalOpen}
        recipe={recipe}
        onClose={handleRateClose}
        onRated={handleRated}
      />
    </>
  );
}
