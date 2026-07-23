import { useEffect, useState } from 'react';
import { getRecipeCategories, RecipeCategory } from '@/services/recipeService';

export function useRecipeCategories(skipAllRecipes?: boolean) {
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipeCategories()
      .then((categories) => {
        setRecipeCategories(categories);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = skipAllRecipes === false || skipAllRecipes === undefined ? [
    new RecipeCategory('🍽', 'All Recipes'),
    ...recipeCategories,
  ] : recipeCategories;

  return {
    categories,
    loading,
  };
}
