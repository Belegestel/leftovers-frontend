import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import {
  bookmarkRecipe,
  getRecipeSummaries,
  unbookmarkRecipe,
} from '@/services/recipeService';
import { isAuthenticated } from '@/services/tokenService';

vi.mock('@/services/recipeService', () => ({
  getRecipeSummaries: vi.fn(),
  bookmarkRecipe: vi.fn(),
  unbookmarkRecipe: vi.fn(),
}));

vi.mock('@/services/tokenService', () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock('@/components/recipe/RecipeCard', () => ({
  RecipeCard: ({
    recipe,
    onBookmarkToggle,
  }: {
    recipe: {
      title: string;
      isBookmarked: boolean;
    };
    onBookmarkToggle: () => void;
  }) => (
    <div>
      <span>{recipe.title}</span>
      <span>{recipe.isBookmarked ? 'saved' : 'not saved'}</span>

      <button onClick={onBookmarkToggle}>save</button>
    </div>
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(getRecipeSummaries).mockResolvedValue([
      {
        id: 1,
        title: 'Pizza',
        description: 'Italian pizza',
        prepTime: 30,
        servings: 2,
        rating: 5,
        ratingCount: 120,
        category: 'Italian',
        imageLink: null,
        isBookmarked: false,
      },
    ]);

    vi.mocked(isAuthenticated).mockReturnValue(true);
  });

  it('loads and displays recipes', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const recipes = await screen.findAllByText('Pizza');
    expect(recipes).toHaveLength(2);
  });

  it('redirects guests to login when trying to save a recipe', async () => {
    const user = userEvent.setup();

    vi.mocked(isAuthenticated).mockReturnValue(false);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const saveButtons = await screen.findAllByRole('button', {
      name: 'save',
    });

    await user.click(saveButtons[0]);

    expect(bookmarkRecipe).not.toHaveBeenCalled();
  });

  it('bookmarks a recipe and updates its state', async () => {
    const user = userEvent.setup();

    vi.mocked(bookmarkRecipe).mockResolvedValue();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const saveButtons = await screen.findAllByRole('button', {
      name: 'save',
    });

    await user.click(saveButtons[0]);

    await waitFor(() => {
      expect(bookmarkRecipe).toHaveBeenCalledWith(1);
    });

    expect(screen.getAllByText('saved')).toHaveLength(2);
  });

  it('unbookmarks a bookmarked recipe', async () => {
    const user = userEvent.setup();

    vi.mocked(getRecipeSummaries).mockResolvedValue([
      {
        id: 1,
        title: 'Pizza',
        description: 'Italian pizza',
        prepTime: 30,
        servings: 2,
        rating: 5,
        ratingCount: 120,
        category: 'Italian',
        imageLink: null,
        isBookmarked: true,
      },
    ]);

    vi.mocked(unbookmarkRecipe).mockResolvedValue();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const saveButtons = await screen.findAllByRole('button', {
      name: 'save',
    });
    await user.click(saveButtons[0]);
    await waitFor(() => {
      expect(unbookmarkRecipe).toHaveBeenCalledWith(1);
    });

    expect(screen.getAllByText('not saved')).toHaveLength(2);
  });
});
