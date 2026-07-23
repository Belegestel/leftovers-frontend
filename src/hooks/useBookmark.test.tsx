import { describe, expect, vi, it, beforeEach } from 'vitest';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('@/services/tokenService', () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock('@/services/recipeService', () => ({
  bookmarkRecipe: vi.fn(),
  unbookmarkRecipe: vi.fn(),
}));

import { renderHook, act } from '@testing-library/react';
import { useBookmark } from './useBookmark';
import { isAuthenticated } from '@/services/tokenService';
import { bookmarkRecipe } from '@/services/recipeService';
import { SnackbarProvider } from '@/components/common/SnackbarProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SnackbarProvider>{children}</SnackbarProvider>
);

describe('useBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects guests to login', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(false);

    const { result } = renderHook(
      () =>
        useBookmark({
          mode: 'single',
          state: {
            setRecipe: vi.fn(),
          },
        }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await result.current.toggleBookmark({
        id: 1,
        isBookmarked: false,
      } as any);
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/en/?saveLogin=true', undefined);
  });

  it('bookmarks authenticated recipe', async () => {
    vi.mocked(isAuthenticated).mockReturnValue(true);
    vi.mocked(bookmarkRecipe).mockResolvedValue(undefined);

    const setRecipe = vi.fn();

    const { result } = renderHook(
      () =>
        useBookmark({
          mode: 'single',
          state: {
            setRecipe,
          },
        }),
      {
        wrapper,
      }
    );

    await act(async () => {
      await result.current.toggleBookmark({
        id: 1,
        isBookmarked: false,
      } as any);
    });

    expect(bookmarkRecipe).toHaveBeenCalledWith(1);
    expect(setRecipe).toHaveBeenCalled();
  });
});
