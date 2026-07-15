import { useEffect, useState } from 'react';
import { getRecipe } from '@/services/recipeService';
import type { Recipe } from '@/types/recipe';
import { useAuth } from '@/context/AuthContext';

export function useRecipe(id: number | undefined) {
  const { authVersion } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function loadRecipe() {
    if (id === undefined) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const recipe = await getRecipe(id);
      setRecipe(recipe);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load recipe'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipe();
  }, [id, authVersion]);

  return {
    recipe,
    setRecipe,
    loading,
    error,
    reloadRecipe: loadRecipe,
  };
}
