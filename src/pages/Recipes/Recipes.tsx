import { Box, Container, Divider, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { useTranslation } from 'react-i18next';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';

type RecipesProps = {
  mode: 'all' | 'saved' | 'my' | 'search';
};

export default function Recipes({ mode }: RecipesProps) {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const searchWord = searchParams.get('search');

  const title =
    mode == 'all'
      ? t('recipes.titles.all')
      : mode == 'saved'
        ? t('recipes.titles.saved')
        : mode == 'my'
          ? t('recipes.titles.my')
          : (searchWord ?? '');

  const category = searchParams.get('category') ?? undefined;

  const savedParam = searchParams.get('saved');
  const saved =
    mode == 'saved' ||
    (savedParam === null ? undefined : savedParam === 'true');

  const ratingParam = searchParams.get('rating');
  const ratingOrderIncr =
    ratingParam === null ? undefined : ratingParam === 'asc';

  const dateParam = searchParams.get('date');
  const dateOrderIncr = dateParam === null ? undefined : dateParam === 'desc';

  const textSearch = searchParams.get('search') ?? undefined;

  const authored = mode == 'my';

  const { recipes, recipesLoading, hasMore, loadMore, loadingMore } =
    useRecipes({
      category,
      saved,
      ratingOrderIncr,
      dateOrderIncr,
      authored,
      title: textSearch,
      description: textSearch,
    });
  const { toggleBookmark } = useBookmark({
    mode: 'list',
  });

  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          mb: 3,
        }}
      >
        {searchWord && (
          <Typography sx={{ color: 'text.secondary' }}>
            Search results for
          </Typography>
        )}
        <Typography variant="h5">
          {searchWord?.trim() ? searchWord : title}
        </Typography>

        <Divider
          sx={{
            mt: 2,
          }}
        />
        <RecipeFilters />
      </Box>

      <RecipeGrid
        recipes={recipes}
        recipesLoading={recipesLoading}
        hasMore={hasMore}
        loadMore={loadMore}
        onBookmarkToggle={toggleBookmark}
        variant={mode === 'my' ? 'own' : 'default'}
        isPrivate={(recipe) => (mode === 'my' ? recipe.isPrivate : false)}
        loadingMore={loadingMore}
      />
    </Container>
  );
}
