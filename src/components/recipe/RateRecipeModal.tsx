import { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { rateRecipe } from '@/services/recipeService';
import type { Recipe } from '@/types/recipe';
import { useSnackbar } from '@/components/common/SnackbarProvider';

type RateRecipeForm = {
  value: number;
};

interface RateRecipeModalProps {
  open: boolean;
  recipe: Recipe;
  onClose: () => void;
  onRated: () => void;
}

export function RateRecipeModal({
  open,
  recipe,
  onClose,
  onRated,
}: RateRecipeModalProps) {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RateRecipeForm>({
    defaultValues: {
      value: recipe.userRating ?? 0,
    },
  });

  useEffect(() => {
    reset({
      value: recipe.userRating ?? 0,
    });
  }, [recipe.userRating, reset]);

  async function onSubmit(data: RateRecipeForm) {
    try {
      await rateRecipe(recipe.id, data.value);

      showSnackbar({
        message: '⭐  Thank you for submitting your rating!',
      });

      onRated();
      onClose();
    } catch (error) {
      console.error('Failed to rate recipe', error);

      showSnackbar({
        message: '❌ Failed to submit your rating.',
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>How would you rate this recipe?</DialogTitle>

      <DialogContent>
        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
          }}
        >
          We’d love to hear your feedback. Your rating helps us enhance the
          recipe and provide a better culinary experience.
        </Typography>

        <Controller
          name="value"
          control={control}
          rules={{
            required: true,
            min: 1,
          }}
          render={({ field }) => (
            <Rating
              value={field.value}
              size="large"
              sx={{
                color: 'rating.main',
              }}
              onChange={(_, value) => field.onChange(value ?? 0)}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Not now</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
