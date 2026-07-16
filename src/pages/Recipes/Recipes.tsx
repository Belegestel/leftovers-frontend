import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';

export default function Recipes() {
  const [searchParams] = useSearchParams();

  const { categories } = useRecipeCategories();

  const category = searchParams.get('category') ?? undefined;

  const normalizedCategories = category
    ? category.split(',').map((selectedCategory) => {
        return (
          categories.find(
            (item) => item.name.toLowerCase() === selectedCategory.toLowerCase()
          )?.name ?? selectedCategory
        );
      })
    : [];

  const title =
    normalizedCategories.length > 0
      ? [...new Set(normalizedCategories)]
          .map((item) => item.replace(/\b\w/g, (char) => char.toUpperCase()))
          .join(', ')
      : 'All Recipes';

  const savedParam = searchParams.get('saved');
  const saved = savedParam === null ? undefined : savedParam === 'true';

  const { recipes, setRecipes } = useRecipes({ category, saved });

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
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
