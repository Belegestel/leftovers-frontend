import { useNavigate } from 'react-router-dom';
import {
  bookmarkRecipe,
  unbookmarkRecipe,
} from '@/services/recipeService';
import { isAuthenticated } from '@/services/tokenService';
import type { RecipeSummary } from '@/types/recipe';

export function useBookmark(
  setRecipes: React.Dispatch<React.SetStateAction<RecipeSummary[]>>,
  setRecipeOfTheDay: React.Dispatch<
    React.SetStateAction<RecipeSummary | null>
  >
) {
  const navigate = useNavigate();

  async function toggleBookmark(recipe: RecipeSummary) {
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
  }

  return {
    toggleBookmark,
  };
}
