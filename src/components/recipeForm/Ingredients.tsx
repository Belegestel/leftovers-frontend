import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import type { RecipeFormValues } from '@/types/recipeForm';

interface IngredientsProps {
  onBack: () => void;
  onNext: () => void;
  isMobile: boolean;
}

export function Ingredients({ onBack, onNext, isMobile }: IngredientsProps) {
  const { control, getValues } = useFormContext<RecipeFormValues>();

  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const ingredients = getValues('ingredients');
  const ingredientsValid =
    ingredients.length > 0 &&
    ingredients.every((ingredient) => ingredient.value.trim().length > 0);

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">
          {t('addRecipe.pages.ingredients.title')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="secondary"
            onClick={onBack}
            sx={{
              border: '1px solid',
              borderColor: 'currentColor',
              overflow: 'nowrap',
            }}
          >
            &lt; {!isMobile && t('addRecipe.back')}
          </Button>

          <Button
            variant="contained"
            disabled={!ingredientsValid}
            onClick={onNext}
          >
            {!isMobile && t('addRecipe.next')} &gt;
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`ingredients.${index}.value`}
            control={control}
            rules={{ required: true, minLength: 1 }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('addRecipe.pages.ingredients.ingredientCounter', {
                  index: index + 1,
                })}
                placeholder={t(
                  'addRecipe.pages.ingredients.ingredientCounterPlaceholder'
                )}
                value={field.value || ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {fields.length > 3 && (
                          <IconButton onClick={() => remove(index)} edge="end">
                            <CloseIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        ))}

        <Button
          variant="text"
          onClick={() => {
            append({ value: '' });
          }}
          sx={{
            alignSelf: 'flex-start',
            color: 'primary.main',
            fontWeight: 600,
            px: 0,
          }}
        >
          + {t('addRecipe.pages.ingredients.ingredientAdd')}
        </Button>
      </Box>
    </Box>
  );
}
