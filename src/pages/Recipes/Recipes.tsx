import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';

export default function Recipes() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category') ?? undefined;

  const title = category
    ? category.replace(/\b\w/g, (char) => char.toUpperCase())
    : 'All Recipes';

  const { recipes, setRecipes } = useRecipes(category);

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
