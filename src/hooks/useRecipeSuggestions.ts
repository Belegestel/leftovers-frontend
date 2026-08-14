import { useEffect, useState } from 'react';
import {
  getRecipeSuggestions,
  type RecipeSuggestions,
} from '@/services/recipeService';

export function useRecipeSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<RecipeSuggestions>({
    names: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions({ names: [] });
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await getRecipeSuggestions(
          trimmedQuery,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setSuggestions(data);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSuggestions({ names: [] });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return {
    suggestions,
    loading,
  };
}
