import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Publication } from './Publication';
import { SnackbarProvider } from '../common/SnackbarProvider';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect } from 'vitest';

describe('Publication', () => {
  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <SnackbarProvider>
          <Publication
            onBack={vi.fn()}
            onSavePrivate={vi.fn().mockResolvedValue(1)}
            onPublish={vi.fn().mockResolvedValue(1)}
            onChangeVisibility={vi.fn()}
            onRecipeDelete={vi.fn()}
            {...props}
          />
        </SnackbarProvider>
      </MemoryRouter>
    );

  it('saves recipe as private', async () => {
    const savePrivate = vi.fn().mockResolvedValue(5);

    renderComponent({
      onSavePrivate: savePrivate,
    });

    fireEvent.click(screen.getByText('Save as private'));

    await waitFor(() => {
      expect(savePrivate).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Recipe saved')).toBeInTheDocument();
  });

  it('opens delete modal and deletes recipe after confirmation', async () => {
    const deleteRecipe = vi.fn();

    renderComponent({
      onSavePrivate: vi.fn().mockResolvedValue({ id: 10 }),
      onRecipeDelete: deleteRecipe,
    });

    fireEvent.click(screen.getByText('Save as private'));

    await waitFor(() =>
      expect(screen.getByText('Recipe saved')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText('Delete the recipe'));

    expect(
      screen.getByText('Are you sure you want to delete the recipe?')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith(10);
    });
  });
});
