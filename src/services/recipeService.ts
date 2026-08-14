import { httpService } from './httpService';
import type { Recipe, RecipeSummary } from '@/types/recipe';
import { uploadService } from './uploadService';

type RecipeSummariesResponse = {
  recipes: RecipeSummary[];
};
type RecipeResponse = Recipe;
export type RecipeSuggestions = {
  names: string[];
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
  return response.data.categories;
}

export async function getRecipeSuggestions(query: string, signal?: AbortSignal): Promise<RecipeSuggestions> {
  const response = await httpService.get<RecipeSuggestions>(
    '/recipes/suggestions/',
    { params: { query }, signal }
  );
  return response.data;
}

export interface RecipeFilters {
  category?: string;
  saved?: boolean;
  ratingOrderIncr?: boolean;
  dateOrderIncr?: boolean;
  description?: string;
  title?: string;
  authored: boolean;
  page?: number;
  limit?: number;
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

async function uploadImage(recipeId: number, image: File) {
  const uploadUrlResponse = await httpService.post<ImageUploadUrlResponse>(
    `/recipes/${recipeId}/image-upload-url`,
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

  await httpService.post(`/recipes/${recipeId}/image-confirm`, {
    key,
  });
}

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
    await uploadImage(createdRecipe.id, image);
  } catch {
    console.error('Failed to clean up after failed recipe image upload');
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
  recipe: EditRecipeRequest,
  image?: File
): Promise<void> {
  await httpService.patch(`/recipes/${id}/edit`, recipe);
  if (image) {
    await uploadImage(id, image);
  }
}

export async function deleteRecipe(id: number): Promise<void> {
  await httpService.post(`/recipes/${id}/delete`);
}
