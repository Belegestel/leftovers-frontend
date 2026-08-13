import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecipeSummaries } from '@/services/recipeService';
import type { RecipeSummary } from '@/types/recipe';
import { useAuth } from '@/context/AuthContext';
import type { RecipeFilters } from '@/services/recipeService';

const PAGE_SIZE = 20;

export function useRecipes(filters?: RecipeFilters) {
  const { authVersion } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ['recipes', authVersion, filters],

    queryFn: ({ pageParam }) =>
      getRecipeSummaries({
        ...(filters ?? { authored: false }),
        page: pageParam,
        limit: PAGE_SIZE,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }

      return allPages.length;
    },
  });

  const recipes: RecipeSummary[] =
    query.data?.pages.flatMap((page) => page) ?? [];

  return {
    recipes,
    recipeOfTheDay: recipes[0] ?? null,

    recipesLoading: query.isLoading,
    loadingMore: query.isFetchingNextPage,

    hasMore: query.hasNextPage ?? false,
    loadMore: query.fetchNextPage,

    reloadRecipes: query.refetch,
  };
}
