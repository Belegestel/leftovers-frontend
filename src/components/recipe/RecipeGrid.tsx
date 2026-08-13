import { Grid, Skeleton, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RecipeCard } from './RecipeCard';
import type { RecipeSummary } from '@/types/recipe';

type RecipeGridProps = {
  recipes: RecipeSummary[];
  recipesLoading: boolean;
  loadingMore: boolean;
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
  if (recipesLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
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

  return (
    <InfiniteScroll
      dataLength={recipes.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {[...Array(4)].map((_, index) => (
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
      }
      endMessage={
        recipes.length > 0 ? (
          <Typography
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            No more recipes
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
