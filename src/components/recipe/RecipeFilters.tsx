import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

interface RecipeFilterForm {
  categories: string[];
  saved: string[];
  rating: string;
  date: string;
}

export function RecipeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useLocalizedNavigate();

  const { categories } = useRecipeCategories(true);

  const categoryNames = categories.map((category) => category.name);

  const normalizeCategory = (category: string) =>
    categoryNames.find(
      (item) => item.toLowerCase() === category.toLowerCase()
    ) ?? category;

  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const filterOpen = Boolean(filterAnchor);
  const ratingOpen = Boolean(ratingAnchor);
  const dateOpen = Boolean(dateAnchor);

  const { control, watch, reset } = useForm<RecipeFilterForm>({
    defaultValues: {
      categories:
        searchParams.get('category')?.split(',').map(normalizeCategory) ?? [],
      saved: searchParams.get('saved')
        ? [searchParams.get('saved') as string]
        : [],
      rating: searchParams.get('rating') ?? 'desc',
      date: searchParams.get('date') ?? 'asc',
    },
  });

  const values = watch();

  useEffect(() => {
    if (location.pathname === '/saved' && values.saved.length > 0) {
      navigate('/recipes', { replace: true });
    }

    const params = new URLSearchParams(searchParams);

    if (values.categories.length === 0) {
      params.delete('category');
    } else {
      params.set(
        'category',
        values.categories.map((category) => category.toLowerCase()).join(',')
      );
    }

    if (values.saved.length === 1) {
      params.set('saved', values.saved[0]);
    } else {
      params.delete('saved');
    }

    params.set('rating', values.rating);
    params.set('date', values.date);

    setSearchParams(params);
  }, [values.categories, values.saved, values.rating, values.date]);

  useEffect(() => {
    reset({
      categories:
        searchParams.get('category')?.split(',').map(normalizeCategory) ?? [],
      saved: searchParams.has('saved')
        ? [searchParams.get('saved') as string]
        : values.saved.length === 2
          ? values.saved
          : [],
      rating: searchParams.get('rating') ?? 'desc',
      date: searchParams.get('date') ?? 'asc',
    });
  }, [searchParams, reset, categoryNames.length]);

  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
        }}
      >
        {!(searchParams.get('search') ?? '') && (
          <Button
            startIcon={<FilterListIcon />}
            onClick={(event) => setFilterAnchor(event.currentTarget)}
            color={filterOpen ? 'primary' : 'secondary'}
            sx={{
              border: 1,
              borderColor: 'currentColor',
              '&:hover svg': {
                transform: 'rotate(180deg) translateY(1px)',
              },
              '& svg': {
                transition: 'transform 200ms ease',
              },
            }}
          >
            {t('recipeCard.filters.filters')}
          </Button>
        )}

        <Button
          startIcon={<SwapVertIcon />}
          onClick={(event) => setRatingAnchor(event.currentTarget)}
          color={ratingOpen ? 'primary' : 'secondary'}
          sx={{
            border: 1,
            borderColor: 'currentColor',
            '&:hover svg': {
              transform: 'rotateY(180deg)',
            },
            '& svg': {
              transition: 'transform 200ms ease',
            },
          }}
        >
          {t('recipeCard.filters.rating')}
        </Button>

        <Button
          startIcon={<SwapVertIcon />}
          onClick={(event) => setDateAnchor(event.currentTarget)}
          color={dateOpen ? 'primary' : 'secondary'}
          sx={{
            border: 1,
            borderColor: 'currentColor',
            '&:hover svg': {
              transform: 'rotateY(180deg)',
            },
            '& svg': {
              transition: 'transform 200ms ease',
            },
          }}
        >
          {t('recipeCard.filters.date')}
        </Button>
      </Box>

      <Menu
        anchorEl={filterAnchor}
        open={filterOpen}
        onClose={() => setFilterAnchor(null)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 250,
          }}
        >
          <Typography
            sx={{
              px: 1,
              py: 1,
              fontWeight: 600,
            }}
          >
            {t('recipeCard.filters.dishType')}
          </Typography>

          {categories.map((category, index) => (
            <Box key={category.name}>
              {index !== 0 && <Divider />}

              <Controller
                name="categories"
                control={control}
                render={({ field }) => {
                  const selected = field.value.includes(category.name);

                  return (
                    <FormControlLabel
                      label={`${category.emoji} ${category.name}`}
                      control={
                        <Checkbox
                          checked={selected}
                          onChange={() => {
                            field.onChange(
                              selected
                                ? field.value.filter(
                                    (item) => item !== category.name
                                  )
                                : [...field.value, category.name]
                            );
                          }}
                        />
                      }
                      sx={{
                        width: '100%',
                        pl: 1,
                        '&:hover .MuiFormControlLabel-label': {
                          transform: 'translateX(10px)',
                        },
                        '& .MuiFormControlLabel-label': {
                          transition: 'transform 150ms ease-out',
                        },
                        '&:hover svg': {
                          transform: 'scale(1.1)',
                        },
                        '& svg': {
                          transition: 'transform 150ms ease',
                        },
                      }}
                    />
                  );
                }}
              />
            </Box>
          ))}

          <Typography
            sx={{
              px: 1,
              py: 1,
              fontWeight: 600,
            }}
          >
            {t('recipeCard.filters.saved')}
          </Typography>

          <Controller
            name="saved"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  label={t('recipeCard.filters.savedRecipes')}
                  control={
                    <Checkbox
                      checked={field.value.includes('true')}
                      onChange={() => {
                        field.onChange(
                          field.value.includes('true')
                            ? field.value.filter((item) => item !== 'true')
                            : [...field.value, 'true']
                        );
                      }}
                    />
                  }
                  sx={{
                    width: '100%',
                    pl: 1,
                    '&:hover .MuiFormControlLabel-label': {
                      transform: 'translateX(10px)',
                    },
                    '& .MuiFormControlLabel-label': {
                      transition: 'transform 150ms ease-out',
                    },
                    '&:hover svg': {
                      transform: 'scale(1.1)',
                    },
                    '& svg': {
                      transition: 'transform 150ms ease',
                    },
                  }}
                />

                <Divider />

                <FormControlLabel
                  label={t('recipeCard.filters.savedRecipes')}
                  control={
                    <Checkbox
                      checked={field.value.includes('false')}
                      onChange={() => {
                        field.onChange(
                          field.value.includes('false')
                            ? field.value.filter((item) => item !== 'false')
                            : [...field.value, 'false']
                        );
                      }}
                    />
                  }
                  sx={{
                    width: '100%',
                    pl: 1,
                    '&:hover .MuiFormControlLabel-label': {
                      transform: 'translateX(10px)',
                    },
                    '& .MuiFormControlLabel-label': {
                      transition: 'transform 150ms ease-out',
                    },
                    '&:hover svg': {
                      transform: 'scale(1.1)',
                    },
                    '& svg': {
                      transition: 'transform 150ms ease',
                    },
                  }}
                />
              </>
            )}
          />
        </Box>
      </Menu>

      <Menu
        anchorEl={ratingAnchor}
        open={ratingOpen}
        onClose={() => setRatingAnchor(null)}
      >
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              sx={{ p: 1 }}
            >
              <FormControlLabel
                value="desc"
                control={<Radio />}
                label={t('recipeCard.filters.highScore')}
                sx={{
                  '&:hover .MuiFormControlLabel-label': {
                    transform: 'translateX(5px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    transition: 'transform 150ms ease',
                  },
                }}
              />

              <FormControlLabel
                value="asc"
                control={<Radio />}
                label={t('recipeCard.filters.lowScore')}
                sx={{
                  '&:hover .MuiFormControlLabel-label': {
                    transform: 'translateX(5px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    transition: 'transform 150ms ease',
                  },
                }}
              />
            </RadioGroup>
          )}
        />
      </Menu>

      <Menu
        anchorEl={dateAnchor}
        open={dateOpen}
        onClose={() => setDateAnchor(null)}
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              sx={{ p: 1 }}
            >
              <FormControlLabel
                value="desc"
                control={<Radio />}
                label={t('recipeCard.filters.newFirst')}
                sx={{
                  '&:hover .MuiFormControlLabel-label': {
                    transform: 'translateX(5px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    transition: 'transform 150ms ease',
                  },
                }}
              />

              <FormControlLabel
                value="asc"
                control={<Radio />}
                label={t('recipeCard.filters.oldFirst')}
                sx={{
                  '&:hover .MuiFormControlLabel-label': {
                    transform: 'translateX(5px)',
                  },
                  '& .MuiFormControlLabel-label': {
                    transition: 'transform 150ms ease',
                  },
                }}
              />
            </RadioGroup>
          )}
        />
      </Menu>
    </>
  );
}
