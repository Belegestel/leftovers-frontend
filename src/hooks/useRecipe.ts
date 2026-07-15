import { useEffect, useState } from 'react';
import { getRecipe } from '@/services/recipeService';
import type { Recipe } from '@/types/recipe';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';

export function useRecipe(id: number | undefined) {
  const { authVersion } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [forbidden, setForbidden] = useState(false);

  async function loadRecipe() {
    if (id === undefined) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setForbidden(false);

      const recipe = await getRecipe(id);
      setRecipe(recipe);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 403) {
        setForbidden(true);
        setRecipe(null);
        setLoading(false);
        return;
      }
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
    forbidden,
    reloadRecipe: loadRecipe,
  };
}
