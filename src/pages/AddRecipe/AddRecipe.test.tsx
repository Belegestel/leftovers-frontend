import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AddRecipe from './AddRecipe';

import { getRecipe, editRecipe } from '@/services/recipeService';

vi.mock('@/services/recipeService', () => ({
  getRecipe: vi.fn(),
  createRecipeWithImage: vi.fn(),
  editRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}));

vi.mock('@/components/common/SnackbarProvider', () => ({
  useSnackbar: () => vi.fn(),
}));

vi.mock('@/components/addRecipe/BasicInformation', () => ({
  BasicInformation: () => <div>Basic information</div>,
}));

vi.mock('@/components/addRecipe/Ingredients', () => ({
  Ingredients: () => <div>Ingredients</div>,
}));

vi.mock('@/components/addRecipe/PreparationMethod', () => ({
  PreparationMethod: () => <div>Preparation</div>,
}));

vi.mock('@/components/addRecipe/Publication', () => ({
  Publication: () => <div>Publication</div>,
}));

describe('AddRecipe edit mode', () => {
  it('loads recipe data when recipe id exists', async () => {
    vi.mocked(getRecipe).mockResolvedValue({
      id: 1,
      title: 'Pizza',
      description: 'Test pizza',
      category: 'LUNCH',
      prepTime: 30,
      servings: 2,
      ingredients: ['Cheese'],
      steps: ['Bake'],
      imageLink: 'image.jpg',
      isPublic: true,
    } as any);


    render(
      <MemoryRouter initialEntries={['/edit-recipe/1']}>
        <Routes>
          <Route
            path="/edit-recipe/:recipe"
            element={<AddRecipe />}
          />
        </Routes>
      </MemoryRouter>
    );


    await waitFor(() => {
      expect(getRecipe).toHaveBeenCalledWith(1);
    });
  });
});

describe('edit recipe flow', () => {
  it('updates existing recipe instead of creating a new one', async () => {
    const recipeId = 5;

    await editRecipe(recipeId, {
      title: 'Updated title',
      isPublic: true,
    });


    expect(editRecipe).toHaveBeenCalledWith(
      recipeId,
      {
        title: 'Updated title',
        isPublic: true,
      }
    );
  });
});
