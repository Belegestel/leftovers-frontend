import { useEffect, useState } from 'react';
import { getRecipeSummaries } from '@/services/recipeService';
import type { RecipeSummary } from '@/types/recipe';
import { useAuth } from '@/context/AuthContext';

export function useRecipes() {
  const { authVersion } = useAuth();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeSummary | null>(
    null
  );


  async function loadRecipes() {
    const recipes = await getRecipeSummaries();

    setRecipes(recipes);
    setRecipeOfTheDay(recipes[0] ?? null);
  }

  useEffect(() => {
    loadRecipes();
  }, [authVersion]);

  return {
    recipes,
    setRecipes,
    recipeOfTheDay,
    setRecipeOfTheDay,
    reloadRecipes: loadRecipes,
  };
}
