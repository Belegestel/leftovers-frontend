import { describe, vi, it, expect } from 'vitest';
import { fireEvent, waitFor, render, screen } from '@testing-library/react';

vi.mock('@/services/recipeService', () => ({
  rateRecipe: vi.fn().mockResolvedValue(undefined),
}));

import { RateRecipeModal } from './RateRecipeModal';
import { SnackbarProvider } from '@/components/common/SnackbarProvider';
import { rateRecipe } from '@/services/recipeService';

describe('RateRecipeModal', () => {
  it('submits selected rating', async () => {
    const onRated = vi.fn();

    render(
      <SnackbarProvider>
        <RateRecipeModal
          open
          recipe={{
            id: 1,
            userRating: null,
          } as any}
          onClose={vi.fn()}
          onRated={onRated}
        />
      </SnackbarProvider>
    );

    fireEvent.click(screen.getByLabelText('5 Stars'));

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(rateRecipe).toHaveBeenCalledWith(1, 5);
      expect(onRated).toHaveBeenCalled();
    });
  });
});
