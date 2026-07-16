import { httpService } from './httpService';
import type { Recipe, RecipeSummary } from '@/types/recipe';

type RecipeSummariesResponse = {
  recipes: RecipeSummary[];
};
type RecipeResponse = {
  recipes: Recipe;
};

export class RecipeCategory {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

type RecipeCategoriesResponse = { categories: string[] };

export async function getRecipeCategories(): Promise<RecipeCategory[]> {
  const response = await httpService.get<RecipeCategoriesResponse>(
    '/recipes/categories'
  );
  return response.data.categories.map((val) => new RecipeCategory(val));
}

export interface RecipeFilters {
  category?: string;
  saved?: boolean;
}
export async function getRecipeSummaries(
  filters?: RecipeFilters
): Promise<RecipeSummary[]> {
  const response = await httpService.get<RecipeSummariesResponse>('/recipes', {
    params: filters,
  });

  return response.data.recipes;
}

export async function getRecipe(id: number): Promise<RecipeResponse> {
  const response = await httpService.get<RecipeResponse>(`/recipes/${id}`);

  return response.data;
}

export async function bookmarkRecipe(id: number): Promise<void> {
  await httpService.post(`/recipes/${id}/bookmark`);
}

export async function unbookmarkRecipe(id: number): Promise<void> {
  await httpService.post(`/recipes/${id}/unbookmark`);
}

export async function rateRecipe(id: number, value: number): Promise<void> {
  await httpService.post(`/recipes/${id}/rate`, { value });
}
