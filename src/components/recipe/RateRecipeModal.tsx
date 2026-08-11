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
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  useEffect(() => {
    reset({
      value: recipe.userRating ?? 0,
    });
  }, [recipe.userRating, reset]);

  async function onSubmit(data: RateRecipeForm) {
    try {
      await rateRecipe(recipe.id, data.value);

      showSnackbar({
        message: `⭐  ${t('modals.rateRecipe.snackbar.success')}`,
      });

      onRated();
      onClose();
    } catch (error) {
      console.error('Failed to rate recipe', error);

      showSnackbar({
        message: `❌ ${t('modals.rateRecipe.snackbar.fail')}`,
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('modals.rateRecipe.title')}</DialogTitle>

      <DialogContent>
        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
          }}
        >
          {t('modals.rateRecipe.description')}
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
        <Button onClick={onClose}>{t('modals.rateRecipe.cancel')}</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {t('modals.rateRecipe.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
