export interface RecipeSummary {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  rating: number;
  ratingCount: number;
  category: string;
  imageLink?: string | null;
  isBookmarked: boolean;
}

export interface Recipe extends RecipeSummary {
  isPublic: boolean;
  authorId: number;
  createdAt: string;
  editedAt: string;
  ingredients: string[];
  steps: string[];
  userRating: number | null;
}
