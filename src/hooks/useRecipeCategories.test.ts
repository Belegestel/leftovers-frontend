import { renderHook, waitFor } from '@testing-library/react';
import { useRecipeCategories } from './useRecipeCategories';
import { getRecipeCategories, RecipeCategory } from '@/services/recipeService';
import { describe, vi, it, expect, beforeEach } from 'vitest';

vi.mock('@/services/recipeService', async () => {
  const actual = await vi.importActual<typeof import('@/services/recipeService')>(
    '@/services/recipeService'
  );
  return {
    ...actual, getRecipeCategories: vi.fn()
  }
});

describe('useRecipeCategories', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('returns only All categories when API returns no categories', async () => {
    vi.mocked(getRecipeCategories).mockResolvedValue([]);
    const { result } = renderHook(() => useRecipeCategories());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].name).toBe('🍽 All recipes');
  });

  it('adds all categories as the first item', async () => {
    vi.mocked(getRecipeCategories).mockResolvedValue([new RecipeCategory('🍽 breakfast')]);
    const { result } = renderHook(() => useRecipeCategories());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories[0].name).toBe('🍽 All recipes');
    expect(result.current.categories[1].name).toBe('🍽 breakfast');
  });

});
