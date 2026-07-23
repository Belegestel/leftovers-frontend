export interface RecipeFormValues {
  title: string;
  description: string;
  category: string;
  prepTime: number | null;
  servings: number;
  ingredients: {value: string}[];
  steps: {value: string}[];
  image: File | string | null;
  isPublic: boolean;
}
