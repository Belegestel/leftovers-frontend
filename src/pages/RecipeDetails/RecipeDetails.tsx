import { Box, Typography } from '@mui/material';
import {
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecipe } from '@/hooks/useRecipe';
import { RecipeDetailsCard } from '@/components/recipe/RecipeDetailsCard';
import { useBookmark } from '@/hooks/useBookmark';
import { isAuthenticated } from '@/services/tokenService';
import { RateRecipeModal } from '@/components/recipe/RateRecipeModal';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

export default function RecipeDetails() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const { id } = useParams();

  const navigate = useLocalizedNavigate();
  const location = useLocation();

  const recipeId = id ? Number(id) : undefined;

  const { recipe, setRecipe, loading, forbidden, error, reloadRecipe } =
    useRecipe(recipeId);

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
    return <Typography>{t('recipeDetails.loading')}</Typography>;
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
        {t('recipeDetails.notExist')}
        </Typography>
      </Box>
    );
  }

  if (error || !recipe) {
    return <Typography>{t('recipeDetails.unable')}</Typography>;
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
