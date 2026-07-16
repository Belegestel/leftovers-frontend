import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecipeCard } from './RecipeCard';
import { vi, expect, describe, it } from 'vitest';

vi.mock('./SaveRecipeButton', () => ({
  SaveRecipeButton: () => <button>save</button>,
}));

vi.mock('./RecipeRating', () => ({
  RecipeRating: () => <div>rating</div>,
}));

const recipe = {
  id: 1,
  title: 'Pizza',
  description: 'Nice pizza',
  imageLink: '',
  rating: 5,
  ratingCount: 10,
  isBookmarked: false,
  isPrivate: true,
  prepTime: 30,
  servings: 1,
  category: 'LUNCH'
};

describe('RecipeCard', () => {
  it('shows private overlay for own private recipes', () => {
    render(
      <MemoryRouter>
        <RecipeCard
          recipe={recipe}
          variant="own"
          isPrivate
          onBookmarkToggle={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not show private overlay normally', () => {
    render(
      <MemoryRouter>
        <RecipeCard
          recipe={recipe}
          onBookmarkToggle={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });
});
