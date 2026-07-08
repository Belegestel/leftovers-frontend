import { httpService } from './httpService';

export class RecipeCategory {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

type RecipeCategoriesResponse = { categories: string };

export async function getRecipeCategories(): Promise<RecipeCategory[]> {
  const response = await httpService.get<RecipeCategoriesResponse>(
    '/recipes/categories'
  );
  return response.data.categories.map((val) => new RecipeCategory(val));
}
