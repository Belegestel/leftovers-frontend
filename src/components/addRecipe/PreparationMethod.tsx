import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { AddRecipeFormValues } from '@/types/addRecipe';

interface PreparationMethodProps {
  onBack: () => void;
  onNext: () => void;
}

export function PreparationMethod({
  onBack,
  onNext,
}: PreparationMethodProps) {
  const { control, register, getValues } =
    useFormContext<AddRecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const steps = getValues('steps');
  const stepsValid =
    steps.length > 0 &&
    steps.every((step) => step.value.trim().length > 0);

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
        <Typography variant="h6">Enter preparation method</Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button variant="secondary" onClick={onBack}>
            &lt; Back
          </Button>

          <Button
            variant="contained"
            disabled={!stepsValid}
            onClick={onNext}
          >
            Next &gt;
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
          <TextField
            key={field.id}
            fullWidth
            label={`Step ${index + 1}`}
            placeholder="Enter preparation step"
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
            {...register(`steps.${index}.value`, {
              required: true,
              minLength: 1,
            })}
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
          + Add a new step
        </Button>
      </Box>
    </Box>
  );
}
