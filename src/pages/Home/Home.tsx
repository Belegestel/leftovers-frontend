import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
export default function Home() {
  const { recipes, setRecipes, recipeOfTheDay, setRecipeOfTheDay } =
    useRecipes();

  const { toggleBookmark } = useBookmark(setRecipes, setRecipeOfTheDay);

  return (
    <Container>
      {recipeOfTheDay && (
        <RecipeCard
          recipe={recipeOfTheDay}
          variant="featured"
          onBookmarkToggle={() => toggleBookmark(recipeOfTheDay)}
        />
      )}

      <Box
        sx={{
          mt: 6,
          mb: 3,
        }}
      >
        <Typography variant="h5">New Recipes</Typography>

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
              md: 4,
            }}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
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
