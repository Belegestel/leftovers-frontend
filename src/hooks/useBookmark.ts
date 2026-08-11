import { useState } from 'react';
import {
  bookmarkRecipe,
  unbookmarkRecipe,
} from '@/services/recipeService';
import { isAuthenticated } from '@/services/tokenService';
import type { Recipe, RecipeSummary } from '@/types/recipe';
import { useSnackbar } from '@/components/common/SnackbarProvider';
import { useLocalizedNavigate } from './useLocalizedNavigate';
import { useTranslation } from 'react-i18next';

type BookmarkMode = 'list' | 'single';

interface ListBookmarkState {
  setRecipes: React.Dispatch<React.SetStateAction<RecipeSummary[]>>;
  setRecipeOfTheDay?: React.Dispatch<
    React.SetStateAction<RecipeSummary | null>
  >;
}

interface SingleBookmarkState {
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
}

type UseBookmarkProps =
  | {
      mode: 'list';
      state: ListBookmarkState;
    }
  | {
      mode: 'single';
      state: SingleBookmarkState;
    };

export function useBookmark({ mode, state }: UseBookmarkProps) {
  const showSnackbar = useSnackbar();
  const navigate = useLocalizedNavigate();
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function toggleBookmark(
    recipe: Recipe | RecipeSummary
  ) {
    if (!isAuthenticated()) {
      navigate('?saveLogin=true');
      return;
    }

    try {
      setLoading(true);

      const bookmarked = recipe.isBookmarked;

      if (bookmarked) {
        await unbookmarkRecipe(recipe.id);

        showSnackbar({
          message:
            `✅ ${t('recipes.snackbar.unsaved')}`,
        });
      } else {
        await bookmarkRecipe(recipe.id);

        showSnackbar({
          message:
            `✅ ${t('recipes.snackbar.saved')}`,
        });
      }

      const updatedRecipe = {
        ...recipe,
        isBookmarked: !bookmarked,
      };

      if (mode === 'single') {
        state.setRecipe(updatedRecipe as Recipe);
      }

      if (mode === 'list') {
        state.setRecipes((currentRecipes) =>
          currentRecipes.map((currentRecipe) =>
            currentRecipe.id === recipe.id
              ? (updatedRecipe as RecipeSummary)
              : currentRecipe
          )
        );

        state.setRecipeOfTheDay?.((currentRecipe) =>
          currentRecipe?.id === recipe.id
            ? (updatedRecipe as RecipeSummary)
            : currentRecipe
        );
      }
    } catch (error) {
      console.error('Failed to update bookmark', error);

      showSnackbar({
        message: "❌ The recipe saved status couldn't be changed",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    toggleBookmark,
    loading,
  };
}
