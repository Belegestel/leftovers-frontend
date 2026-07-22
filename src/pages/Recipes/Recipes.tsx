import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { useTranslation } from 'react-i18next';

type RecipesProps = {
  mode: 'all' | 'saved' | 'my';
};

export default function Recipes({ mode }: RecipesProps) {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const title =
    mode == 'all'
      ? t('recipes.titles.all')
      : mode == 'saved'
        ? t('recipes.titles.saved')
        : t('recipes.titles.my');

  const category = searchParams.get('category') ?? undefined;

  const savedParam = searchParams.get('saved');
  const saved =
    mode == 'saved' ||
    (savedParam === null ? undefined : savedParam === 'true');

  const ratingParam = searchParams.get('rating');
  const ratingOrderIncr =
    ratingParam === null ? undefined : ratingParam === 'desc';

  const dateParam = searchParams.get('date');
  const dateOrderIncr = dateParam === null ? undefined : dateParam === 'asc';

  const authored = mode == 'my';

  const { recipes, setRecipes } = useRecipes({
    category,
    saved,
    ratingOrderIncr,
    dateOrderIncr,
    authored,
  });

  const { toggleBookmark } = useBookmark({
    mode: 'list',
    state: {
      setRecipes,
    },
  });

  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          mb: 3,
        }}
      >
        <Typography variant="h5">{title}</Typography>

        <Divider
          sx={{
            mt: 2,
          }}
        />
        <RecipeFilters />
      </Box>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid
            key={recipe.id}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
            sx={{
              display: 'flex',
            }}
          >
            <RecipeCard
              recipe={recipe}
              onBookmarkToggle={() => toggleBookmark(recipe)}
              variant={mode === 'my' ? 'own' : 'default'}
              isPrivate={mode === 'my' ? recipe.isPrivate : false}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
