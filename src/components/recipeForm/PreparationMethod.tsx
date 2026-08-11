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

interface PreparationMethodProps {
  onBack: () => void;
  onNext: () => void;
}

export function PreparationMethod({ onBack, onNext }: PreparationMethodProps) {
  const { control, register, getValues } =
    useFormContext<RecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const { t } = useTranslation();

  const steps = getValues('steps');
  const stepsValid =
    steps.length > 0 && steps.every((step) => step.value.trim().length > 0);

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
          {t('addRecipe.pages.preparation.title')}
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
            sx={{ border: '1px solid', borderColor: 'currentColor' }}
          >
            &lt; {t('addRecipe.back')}
          </Button>

          <Button variant="contained" disabled={!stepsValid} onClick={onNext}>
            {t('addRecipe.next')} &gt;
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
            name={`steps.${index}.value`}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
            label={t('addRecipe.pages.preparation.stepLabel', {
              index: index + 1,
            })}
            placeholder={t('addRecipe.pages.preparation.stepPlaceholder')}
                value={field.value}
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
          + {t('addRecipe.pages.preparation.addStep')}
        </Button>
      </Box>
    </Box>
  );
}
