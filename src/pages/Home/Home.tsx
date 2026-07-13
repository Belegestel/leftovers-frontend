import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { getRecipeSummaries } from '@/services/recipeService';
import type { RecipeSummary } from '@/types/recipe';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeSummary | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    async function loadRecipeOfTheDay() {
      const recipes = await getRecipeSummaries();

      if (recipes.length > 0) {
        if (recipes.length > 0) {
          const today = new Date();
          const seed =
            today.getFullYear() * 10000 +
            (today.getMonth() + 1) * 100 +
            today.getDate();

          const random = Math.sin(seed) * 10000;
          const randomIndex = Math.floor(
            (random - Math.floor(random)) * recipes.length
          );

          setRecipeOfTheDay(recipes[randomIndex]);
        }
      }
    }

    loadRecipeOfTheDay();
  }, []);

  return (
    <Container>
      {recipeOfTheDay && (
        <RecipeCard
          recipe={recipeOfTheDay}
          variant="featured"
          onSave={() => {
            navigate('?saveLogin=true')
          }}
        />
      )}
    </Container>
  );
}
