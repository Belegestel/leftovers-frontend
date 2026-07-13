import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import {
  bookmarkRecipe,
  getRecipeSummaries,
  unbookmarkRecipe,
} from '@/services/recipeService';
import { isAuthenticated } from '@/services/tokenService';
import type { RecipeSummary } from '@/types/recipe';
import { RecipeCard } from '@/components/recipe/RecipeCard';

export default function Home() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] =
    useState<RecipeSummary | null>(null);

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

  const handleBookmarkToggle = async (recipe: RecipeSummary) => {
    if (!isAuthenticated()) {
      navigate('?saveLogin=true');
      return;
    }

    try {
      if (recipe.isBookmarked) {
        await unbookmarkRecipe(recipe.id);
      } else {
        await bookmarkRecipe(recipe.id);
      }

      setRecipes((currentRecipes) =>
        currentRecipes.map((currentRecipe) =>
          currentRecipe.id === recipe.id
            ? {
                ...currentRecipe,
                isBookmarked: !currentRecipe.isBookmarked,
              }
            : currentRecipe
        )
      );

      setRecipeOfTheDay((currentRecipe) =>
        currentRecipe?.id === recipe.id
          ? {
              ...currentRecipe,
              isBookmarked: !currentRecipe.isBookmarked,
            }
          : currentRecipe
      );
    } catch (error) {
      console.error('Failed to update bookmark', error);
    }
  };

  return (
    <Container>
      {recipeOfTheDay && (
        <RecipeCard
          recipe={recipeOfTheDay}
          variant="featured"
          onBookmarkToggle={() =>
            handleBookmarkToggle(recipeOfTheDay)
          }
        />
      )}

      <Box
        sx={{
          mt: 6,
          mb: 3,
        }}
      >
        <Typography variant="h5">
          New Recipes
        </Typography>

        <Divider
          sx={{
            mt: 2,
          }}
        />
      </Box>

      <Grid
        container
        spacing={3}
      >
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
              onBookmarkToggle={() =>
                handleBookmarkToggle(recipe)
              }
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
