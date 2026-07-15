import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarkRecipe, unbookmarkRecipe } from '@/services/recipeService';
import { isAuthenticated } from '@/services/tokenService';
import type { Recipe } from '@/types/recipe';

export function useRecipeBookmark(
  recipe: Recipe | null,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>
) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function toggleBookmark() {
    if (!recipe) {
      return;
    }

    if (!isAuthenticated()) {
      navigate('?saveLogin=true');
      return;
    }

    try {
      setLoading(true);

      if (recipe.isBookmarked) {
        await unbookmarkRecipe(recipe.id);
      } else {
        await bookmarkRecipe(recipe.id);
      }

      setRecipe((currentRecipe) =>
        currentRecipe
          ? {
              ...currentRecipe,
              isBookmarked: !currentRecipe.isBookmarked,
            }
          : null
      );
    } catch (error) {
      console.error('Failed to update bookmark', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    toggleBookmark,
    loading,
  };
}
