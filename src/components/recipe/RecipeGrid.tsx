import { Grid, Skeleton, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RecipeCard } from './RecipeCard';
import type { RecipeSummary } from '@/types/recipe';
import { useTranslation } from 'react-i18next';

type RecipeGridProps = {
  recipes: RecipeSummary[];
  recipesLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onBookmarkToggle: (recipe: RecipeSummary) => void;
  variant?: 'default' | 'own';
  isPrivate?: (recipe: RecipeSummary) => boolean;
};

export function RecipeGrid({
  recipes,
  recipesLoading,
  hasMore,
  loadMore,
  onBookmarkToggle,
  variant = 'default',
  isPrivate,
}: RecipeGridProps) {
  const { t } = useTranslation();

  function recipeSkeleton(arrayCount: number) {
    return (
      <Grid container spacing={3}>
        {[...Array(arrayCount)].map((_, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (recipesLoading) {
    return recipeSkeleton(8);
  }

  return (
    <InfiniteScroll
      dataLength={recipes.length}
      next={loadMore}
      hasMore={hasMore}
      loader={recipeSkeleton(4)}
      endMessage={
        recipes.length > 0 ? (
          <Typography
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            {t('recipes.nomore')}
          </Typography>
        ) : null
      }
    >
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
              variant={variant}
              isPrivate={isPrivate?.(recipe) ?? false}
              onBookmarkToggle={() => onBookmarkToggle(recipe)}
            />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
}
