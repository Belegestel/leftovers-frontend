import {
  Box,
  Container,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
import { useTranslation } from 'react-i18next';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';

export default function Home() {
  const {
    recipes,
    recipeOfTheDay,
    recipesLoading,
    hasMore,
    loadMore,
  } = useRecipes();

  const { t } = useTranslation();

  const { toggleBookmark } = useBookmark({
    mode: 'list',
  });

  return (
    <Container sx={{ mt: 5 }}>
      {recipesLoading ? (
        <Skeleton variant="rectangular" width="100%" height={360} />
      ) : (
        recipeOfTheDay && (
          <RecipeCard
            recipe={recipeOfTheDay}
            variant="featured"
            onBookmarkToggle={() => toggleBookmark(recipeOfTheDay)}
          />
        )
      )}

      <Box
        sx={{
          mt: 6,
          mb: 3,
        }}
      >
        <Typography variant="h5">{t('home.newRecipes')}</Typography>

        <Divider
          sx={{
            mt: 2,
          }}
        />
      </Box>

      <RecipeGrid
        recipes={recipes}
        recipesLoading={recipesLoading}
        hasMore={hasMore}
        loadMore={loadMore}
        onBookmarkToggle={toggleBookmark}
      />
    </Container>
  );
}
