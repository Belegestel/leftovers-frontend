export interface AddRecipeFormValues {
  title: string;
  description: string;
  category: string;
  prepTime: number | null;
  servings: number;
  ingredients: {value: string}[];
  steps: {value: string}[];
  image: File | null;
  isPublic: boolean;
}
