import { it, describe, vi, expect, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useRecipe } from './useRecipe';
import * as recipeService from '@/services/recipeService';
import { useAuth } from '@/context/AuthContext';
import { AxiosError, AxiosHeaders } from 'axios';
import type { Recipe } from '@/types/recipe';

vi.mock('@/services/recipeService');

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockedGetRecipe = vi.mocked(recipeService.getRecipe);
const mockedUseAuth = vi.mocked(useAuth);

describe('useRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      authVersion: 0,
      authChanged: vi.fn(),
    });
  });

  it('loads recipe successfully', async () => {
    mockedGetRecipe.mockResolvedValue({
      id: 1,
      title: 'Pasta',
      userRating: null,
      description: 'Pasta, tasty',
      prepTime: 1,
      servings: 2,
      rating: 3,
      ratingCount: 4,
      category: 'BREAKFAST',
      imageLink: null,
      isBookmarked: false,
      isPublic: true,
      authorId: 5,
      createdAt: 'date',
      editedAt: 'date',
      ingredients: [],
      steps: [],
    });

    const { result } = renderHook(() => useRecipe(1));

    await waitFor(() => {
      expect(result.current.recipe).not.toBeNull();
    });

    expect(result.current.recipe?.title).toBe('Pasta');
    expect(result.current.loading).toBe(false);
  });

  it('handles forbidden recipes', async () => {
    mockedGetRecipe.mockRejectedValue(
      new AxiosError(
        'Forbidden',
        'ERR_BAD_REQUEST',
        {
          headers: new AxiosHeaders(),
        },
        undefined,
        {
          status: 403,
          statusText: 'Forbidden',
          headers: {},
          config: {
            headers: new AxiosHeaders(),
          },
          data: {},
        }
      )
    );

    const { result } = renderHook(() => useRecipe(1));

    await waitFor(() => {
      expect(result.current.forbidden).toBe(true);
    });

    expect(result.current.recipe).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('reloads recipe', async () => {
    mockedGetRecipe
      .mockResolvedValueOnce({
        id: 1,
        rating: 3,
      } as Recipe)
      .mockResolvedValueOnce({
        id: 1,
        rating: 5,
      } as Recipe);

    const { result } = renderHook(() => useRecipe(1));

    await waitFor(() => {
      expect(result.current.recipe?.rating).toBe(3);
    });

    await act(async () => result.current.reloadRecipe());

    await waitFor(() => {
      expect(result.current.recipe?.rating).toBe(5);
    });

    expect(mockedGetRecipe).toHaveBeenCalledTimes(2);
  });
});
