import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

interface SingleBookmarkState {
  setRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
}

type UseBookmarkProps =
  | {
      mode: 'list';
    }
  | {
      mode: 'single';
      state: SingleBookmarkState;
    };

export function useBookmark({ mode, ...props }: UseBookmarkProps) {
  const showSnackbar = useSnackbar();
  const navigate = useLocalizedNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  async function toggleBookmark(recipe: RecipeSummary) {
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
          message: `✅ ${t('recipes.snackbar.unsaved')}`,
        });
      } else {
        await bookmarkRecipe(recipe.id);

        showSnackbar({
          message: `✅ ${t('recipes.snackbar.saved')}`,
        });
      }

      if (mode === 'single') {
        props.state.setRecipe((currentRecipe) =>
          currentRecipe
            ? {
                ...currentRecipe,
                isBookmarked: !bookmarked,
              }
            : null,
        );
      }

      if (mode === 'list') {
        await queryClient.invalidateQueries({
          queryKey: ['recipes'],
        });
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
