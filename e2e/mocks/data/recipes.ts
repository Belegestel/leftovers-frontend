export const categoriesResponse = {
  categories: [
    {
      emoji: '🥪',
      name: 'Breakfasts',
      id: 'BREAKFAST',
    },
    {
      emoji: '🍲',
      name: 'Soups',
      id: 'SOUPS',
    },
    {
      emoji: '🍔',
      name: 'Lunch',
      id: 'LUNCH',
    },
    {
      emoji: '🥐',
      name: 'Baking',
      id: 'BAKING',
    },
    {
      emoji: '🧁',
      name: 'Desserts',
      id: 'DESSERTS',
    },
    {
      emoji: '🍹',
      name: 'Drinks',
      id: 'DRINKS',
    },
    {
      emoji: '🍿',
      name: 'Snacks',
      id: 'SNACKS',
    },
    {
      emoji: '🥗',
      name: 'Salads',
      id: 'SALADS',
    },
  ],
};

export const recipesResponse = {
  recipes: [
    {
      id: 3,
      title: 'Pizza',
      description: 'Tasty pizza, good for everyone!',
      prepTime: 30,
      rating: 4,
      ratingCount: 2,
      servings: 4,
      isBookmarked: false,
      isPrivate: false,
    },
    {
      id: 181,
      title: 'oik',
      description: 'jhgv',
      prepTime: 15,
      rating: 4,
      ratingCount: 2,
      servings: 1,
      isBookmarked: false,
      isPrivate: false,
    },
  ],
};

export const recipeDetailsResponse = {
  id: 3,
  title: 'Pizza',
  description: 'Tasty pizza, good for everyone!',
  prepTime: 30,
  isPublic: true,
  authorId: 1,
  createdAt: '2026-07-14T09:28:38.623Z',
  editedAt: '2026-08-10T12:26:18.044Z',
  rating: 4,
  category: 'LUNCH',
  ingredients: ['food', 'time'],
  steps: ['prepare', 'consume', 'rest'],
  imageLink:
    'this/is/my/image/link',
  servings: 4,
  ratingCount: 2,
  isBookmarked: false,
  userRating: null,
};

export const breakfastRecipesResponse = {
  recipes: [
    {
      id: 100,
      title: 'Breakfast Pancakes',
      description: 'Fluffy pancakes',
      prepTime: 20,
      rating: 5,
      ratingCount: 3,
      servings: 2,
      isBookmarked: false,
      isPrivate: false,
    },
  ],
};

export const recipeCreatedResponse = {
  id: 0,
  title: 'string',
  description: 'string',
  servings: 0,
  prepTime: 0,
  isPublic: true,
  authorId: 0,
  createdAt: '2026-08-17T11:08:43.820Z',
  editedAt: '2026-08-17T11:08:43.820Z',
  rating: 0,
  category: 'string',
  ingredients: ['string'],
  steps: ['string'],
  imageLink: {},
};
