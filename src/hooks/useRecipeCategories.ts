import { useEffect, useState } from 'react';
import { getRecipeCategories, RecipeCategory } from '@/services/recipeService';

export function useRecipeCategories() {
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipeCategories()
      .then(setRecipeCategories)
      .finally(() => setLoading(false));
  }, []);
  const categories: RecipeCategory[] = [
    new RecipeCategory('🍽 All recipes'),
    ...recipeCategories.map((category) => new RecipeCategory(category.name)),
  ];
  return { categories, loading };
}
