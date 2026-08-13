import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeGrid } from './RecipeGrid';
import type { RecipeSummary } from '@/types/recipe';
import { describe, vi, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockRecipes: RecipeSummary[] = [
  {
    id: 1,
    title: 'Pizza',
    servings: 2,
    isBookmarked: false,
    rating: 4,
    ratingCount: 2,
    isPrivate: false,
    description: 'Tasty pizza',
    prepTime: 10,
    category: 'SOUPS',
  },
  {
    id: 2,
    title: 'Pasta',
    servings: 2,
    isBookmarked: true,
    rating: 5,
    ratingCount: 3,
    isPrivate: false,
    description: 'Tasty pasta',
    prepTime: 11,
    category: 'SOUPS',
  },
];

describe('RecipeGrid', () => {
  const defaultProps = {
    recipes: mockRecipes,
    recipesLoading: false,
    loadingMore: false,
    hasMore: false,
    loadMore: vi.fn(),
    onBookmarkToggle: vi.fn(),
  };

  it('renders recipes', () => {
    render(
      <MemoryRouter>
        <RecipeGrid {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });

  it('shows loading skeletons while initially loading', () => {
    render(
      <MemoryRouter>
        <RecipeGrid {...defaultProps} recipes={[]} recipesLoading />
      </MemoryRouter>
    );

    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(8);
  });

  it('shows loading indicator when loading more recipes', () => {
    render(
      <MemoryRouter>
        <RecipeGrid {...defaultProps} loadingMore hasMore />
      </MemoryRouter>
    );

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(4);
  });

  it('shows end of list message when there are no more recipes', () => {
    render(
      <MemoryRouter>
        <RecipeGrid {...defaultProps} hasMore={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/no more recipes/i)).toBeInTheDocument();
  });

  it('calls onBookmarkToggle when a recipe bookmark is clicked', async () => {
    const user = userEvent.setup();
    const onBookmarkToggle = vi.fn();

    render(
      <MemoryRouter>
        <RecipeGrid {...defaultProps} onBookmarkToggle={onBookmarkToggle} />
      </MemoryRouter>
    );

    const bookmarkButtons = screen.getAllByLabelText(/bookmark/i);

    await user.click(bookmarkButtons[0]);

    expect(onBookmarkToggle).toHaveBeenCalledWith(mockRecipes[0]);
  });
});
