import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, Container, Grid, Typography } from '@mui/material';
import { getRecipeSummaries } from '@/services/recipeService';
import type { RecipeSummary } from '@/types/recipe';
import { RecipeCard } from '@/components/recipe/RecipeCard';

export default function Home() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeSummary | null>(
    null
  );

  useEffect(() => {
    async function loadRecipes() {
      const recipes = await getRecipeSummaries();

      setRecipes(recipes);

      if (recipes.length > 0) {
        setRecipeOfTheDay(recipes[0]);
      }
    }

    loadRecipes();
  }, []);

  return (
    <Container>
      {recipeOfTheDay && (
        <RecipeCard
          recipe={recipeOfTheDay}
          variant="featured"
          onSave={() => navigate('?saveLogin=true')}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          mt: 6,
          mb: 1,
        }}
      >
        New Recipes
      </Typography>

      <Divider sx={{ mb: 4 }} />

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
              justifyContent: 'space-between',
            }}
          >
            <RecipeCard
              recipe={recipe}
              onSave={() => navigate('?saveLogin=true')}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
