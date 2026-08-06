import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { RecipeDetailsCard } from './RecipeDetailsCard';
import type { Recipe } from '@/types/recipe';

const recipe = {
  id: 1,
  title: 'Pizza',
  description: 'Nice pizza',
  ingredients: ['Cheese', 'Tomato'],
  steps: ['Mix dough', 'Bake'],
  prepTime: 30,
  rating: 4,
  ratingCount: 10,
  userRating: null,
  isBookmarked: false,
} as Recipe;

describe('RecipeDetailsCard', () => {
  it('renders recipe information', () => {
    render(
      <RecipeDetailsCard
        recipe={recipe}
        onBookmarkToggle={vi.fn()}
        onRate={vi.fn()}
      />
    );

    expect(screen.getByText('Pizza')).toBeInTheDocument();

    expect(screen.getByText('Cheese')).toBeInTheDocument();

    expect(screen.getByText('Mix dough')).toBeInTheDocument();
  });

  it('shows rate button for unrated recipe', () => {
    render(
      <RecipeDetailsCard
        recipe={recipe}
        onBookmarkToggle={vi.fn()}
        onRate={vi.fn()}
      />
    );

    expect(screen.getByText('Rate the recipe')).toBeInTheDocument();
  });

  it('shows rated state', () => {
    render(
      <RecipeDetailsCard
        recipe={{
          ...recipe,
          userRating: 5,
        }}
        onBookmarkToggle={vi.fn()}
        onRate={vi.fn()}
      />
    );

    expect(screen.getByText('Recipe rated')).toBeInTheDocument();
  });

  it('calls rate callback', () => {
    const onRate = vi.fn();

    render(
      <RecipeDetailsCard
        recipe={recipe}
        onBookmarkToggle={vi.fn()}
        onRate={onRate}
      />
    );

    fireEvent.click(screen.getByText('Rate the recipe'));

    expect(onRate).toHaveBeenCalled();
  });
});
