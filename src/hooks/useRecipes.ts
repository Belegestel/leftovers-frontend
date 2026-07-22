import { useEffect, useState } from 'react';
import { getRecipeSummaries } from '@/services/recipeService';
import type { RecipeSummary } from '@/types/recipe';
import { useAuth } from '@/context/AuthContext';
import type { RecipeFilters } from '@/services/recipeService';

export function useRecipes(filters?: RecipeFilters) {
  const { authVersion } = useAuth();

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<RecipeSummary | null>(
    null
  );

  async function loadRecipes() {
    try {
      const recipes = await getRecipeSummaries(filters);

      setRecipes(recipes);
      setRecipeOfTheDay(recipes[0] ?? null);
    } catch {
      setRecipes([]);
      setRecipeOfTheDay(null);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, [
    authVersion,
    filters?.category,
    filters?.saved,
    filters?.dateOrderIncr,
    filters?.ratingOrderIncr,
    filters?.authored,
  ]);

  return {
    recipes,
    setRecipes,
    recipeOfTheDay,
    setRecipeOfTheDay,
    reloadRecipes: loadRecipes,
  };
}
