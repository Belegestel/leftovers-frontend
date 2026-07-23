import { httpService } from './httpService';
import type { Recipe, RecipeSummary } from '@/types/recipe';
import { uploadService } from './uploadService';

type RecipeSummariesResponse = {
  recipes: RecipeSummary[];
};
type RecipeResponse = {
  recipes: Recipe;
};

export class RecipeCategory {
  emoji: string;
  name: string;
  id: string;

  constructor(emoji: string, name: string, id: string) {
    this.name = name;
    this.emoji = emoji;
    this.id = id;
  }
}

type RecipeCategoriesResponse = { categories: RecipeCategory[] };

export async function getRecipeCategories(): Promise<RecipeCategory[]> {
  const response = await httpService.get<RecipeCategoriesResponse>(
    '/recipes/categories'
  );
  console.log('resp', response)
  return response.data.categories;
}

export interface RecipeFilters {
  category?: string;
  saved?: boolean;
  ratingOrderIncr?: boolean;
  dateOrderIncr?: boolean;
  authored: boolean;
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

type CreateRecipeRequest = {
  title: string;
  description: string;
  category: string;
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  isPublic: boolean;
};
type CreateRecipeResponse = Recipe;
type ImageUploadUrlResponse = {
  url: string;
  key: string;
};

export async function createRecipeWithImage(
  recipe: CreateRecipeRequest,
  image: File | null
): Promise<CreateRecipeResponse> {
  const createResponse = await httpService.post<CreateRecipeResponse>(
    '/recipes',
    recipe
  );

  const createdRecipe = createResponse.data;
  if (!image) {
    return createdRecipe;
  }
  try {
    const uploadUrlResponse = await httpService.post<ImageUploadUrlResponse>(
      `/recipes/${createdRecipe.id}/image-upload-url`,
      {
        fileName: image.name,
        fileType: image.type,
      }
    );

    const { url, key } = uploadUrlResponse.data;

    await uploadService.put(url, image, {
      headers: {
        'Content-Type': image.type,
      },
    });

    await httpService.post(`/recipes/${createdRecipe.id}/image-confirm`, {
      key,
    });
  } catch (error) {
    try {
      await httpService.post(`/recipes/${createdRecipe.id}/delete`);
    } catch {
      console.error('Failed to clean up after failed recipe image upload');
    }
  }

  return createdRecipe;
}

type EditRecipeRequest = {
  title?: string;
  description?: string;
  category?: string;
  prepTime?: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  isPublic?: boolean;
};
export async function editRecipe(
  id: number,
  recipe: EditRecipeRequest
): Promise<void> {
  await httpService.post(`/recipes/${id}/edit`, recipe);
}

export async function deleteRecipe(id: number): Promise<void> {
  await httpService.post(`/recipes/${id}/delete`);
}
