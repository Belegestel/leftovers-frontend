import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Publication } from './Publication';
import { SnackbarProvider } from '../common/SnackbarProvider';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect } from 'vitest';

vi.mock('../common/SnackbarProvider', async () => {
  const actual = await vi.importActual<
    typeof import('../common/SnackbarProvider')
  >('../common/SnackbarProvider');

  return {
    ...actual,
    useSnackbar: () => vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Publication', () => {
  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <SnackbarProvider>
          <Publication
            onBack={vi.fn()}
            onPublish={vi.fn().mockResolvedValue(1)}
            onChangeVisibility={vi.fn()}
            onSavePrivate={vi.fn().mockResolvedValue(2)}
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
  });

  it('opens delete modal and deletes recipe after confirmation', async () => {
    const deleteRecipe = vi.fn();

    renderComponent({
      recipeId: 10,
      onRecipeDelete: deleteRecipe,
    });
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

describe('Publication', () => {
  const props = {
    onBack: vi.fn(),
    onSavePrivate: vi.fn(),
    onPublish: vi.fn(),
    onChangeVisibility: vi.fn(),
    onRecipeDelete: vi.fn(),
  };

  it('disables publish button when editing a published recipe and nothing changed', () => {
    render(
      <Publication
        {...props}
        recipeId={10}
        isPublic={true}
        onSavePrivate={vi.fn()}
        onPublish={vi.fn()}
        isDirty={false}
      />
    );

    expect(
      screen.getByRole('button', {
        name: /Recipe published/i,
      })
    ).toBeDisabled();
  });

  it('enables buttons after form changes', () => {
    render(
      <Publication
        {...props}
        recipeId={10}
        onSavePrivate={vi.fn()}
        onPublish={vi.fn()}
        isPublic={true}
        isDirty={true}
      />
    );

    expect(
      screen.getByRole('button', {
        name: /publish the recipe/i,
      })
    ).not.toBeDisabled();
  });
});
