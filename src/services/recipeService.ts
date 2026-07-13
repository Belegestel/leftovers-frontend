import { httpService } from './httpService';
import type { Recipe, RecipeSummary } from '@/types/recipe';

type RecipeSummariesResponse = {
  recipes: RecipeSummary[];
};
type RecipeResponse = {
  recipes: Recipe[];
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

export async function getRecipeSummaries(): Promise<RecipeSummary[]> {
  const response = await httpService.get<RecipeSummariesResponse>('/recipes');
  return response.data.recipes;
}

export async function getRecipe(id: number): Promise<Recipe> {
  const response = await httpService.get<RecipeResponse>(`/recipes/${id}`);

  return response.data.recipes[0];
}
