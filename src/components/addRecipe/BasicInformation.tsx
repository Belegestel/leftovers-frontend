import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Controller, useFormContext } from 'react-hook-form';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import type { AddRecipeFormValues } from '@/types/addRecipe';

interface BasicInformationProps {
  onNext: () => void;
}

export function BasicInformation({ onNext }: BasicInformationProps) {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useFormContext<AddRecipeFormValues>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { categories, loading: loadingCategories } = useRecipeCategories();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const image = watch('image');
  const title = watch('title');
  const description = watch('description');

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    if (typeof image === 'string') {
      setImagePreview(image);
      return;
    }

    const url = URL.createObjectURL(image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.size <= 3 * 1024 * 1024 &&
      ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'].indexOf(
        file.type
      ) != -1
    ) {
      setValue('image', file, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 5,
        mt: 4,
      }}
    >
      <Box sx={{ width: 300 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          Add photo
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,image/png,image/jpeg,image/gif"
          hidden
          onChange={handleImageChange}
        />

        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            width: 300,
            height: 300,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            gap: 2,
            textAlign: 'center',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'upload.light',
              borderColor: 'upload.main',
            },
          }}
        >
          {imagePreview ? (
            <Box
              component="img"
              src={imagePreview}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <>
              <UploadFileIcon
                sx={{
                  fontSize: 48,
                  color: 'upload.main',
                }}
              />

              <Typography variant="body2" color="text.secondary">
                <Box
                  component="span"
                  sx={{
                    color: 'upload.main',
                    fontWeight: 600,
                  }}
                >
                  Click to upload
                </Box>{' '}
                or drag and drop
                <br />
                SVG, PNG, JPG or GIF
                <br />
                (max. 3MB)
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
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
          <Typography variant="h6">Add basic information</Typography>

          <Button
            variant="contained"
            disabled={!isValid || !image}
            onClick={onNext}
          >
            Next &gt;
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <TextField
            label="Title*"
            placeholder="Enter recipe title"
            error={!!errors.title && !!title}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('title', {
              required: true,
              maxLength: 100,
              minLength: 3,
            })}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: 'right',
            }}
          >
            {title?.length ?? 0}/100
          </Typography>

          <TextField
            label="Description*"
            placeholder="Enter recipe description"
            error={!!errors.description && !!description}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('description', {
              required: true,
              maxLength: 200,
            })}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: 'right',
            }}
          >
            {description?.length ?? 0}/200
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel shrink>Category*</InputLabel>

              <Controller
                name="category"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    disabled={loadingCategories}
                    label="Category*"
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography color="secondary">
                            Choose category
                          </Typography>
                        );
                      }

                      return selected;
                    }}
                  >
                    {categories
                      .filter((_, index) => index != 0)
                      .map((category) => (
                        <MenuItem
                          key={category.name}
                          value={category.name
                            .slice(2)
                            .trim()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        >
                          {category.name
                            .slice(2)
                            .trim()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel shrink>Preparation time*</InputLabel>

              <Controller
                name="prepTime"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    label="Preparation time*"
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography color="secondary">Choose</Typography>
                        );
                      }

                      return Number(selected) >= 61
                        ? 'More than 60 minutes'
                        : `Up to ${selected} minutes`;
                    }}
                  >
                    <MenuItem value={15}>Up to 15 minutes</MenuItem>
                    <MenuItem value={30}>Up to 30 minutes</MenuItem>
                    <MenuItem value={60}>Up to 60 minutes</MenuItem>
                    <MenuItem value={90}>More than 60 minutes</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Servings*"
              error={!!errors.servings}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              {...register('servings', {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  Number.isInteger(value) && value > 0
                    ? true
                    : 'Servings must be a positive whole number',
              })}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
