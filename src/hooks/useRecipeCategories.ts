import { useEffect, useState } from 'react';
import { getRecipeCategories, RecipeCategory } from '@/services/recipeService';

let cachedCategories: RecipeCategory[] | null = null;

let categoriesPromise: Promise<RecipeCategory[]> | null = null;

export function useRecipeCategories() {
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategory[]>(
    cachedCategories ?? []
  );

  const [loading, setLoading] = useState(cachedCategories === null);

  useEffect(() => {
    if (cachedCategories) {
      return;
    }

    if (!categoriesPromise) {
      categoriesPromise = getRecipeCategories();
    }

    categoriesPromise
      .then((categories) => {
        cachedCategories = categories;
        setRecipeCategories(categories);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    ...recipeCategories.map(
      (category) =>
        new RecipeCategory(
          category.name
            .slice(2)
            .trim()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        )
    ),
  ];

  return {
    categories,
    loading,
  };
}
