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
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecipeCategories } from '@/hooks/useRecipeCategories';

interface RecipeFilterForm {
  categories: string[];
  saved: string[];
  rating: string;
  date: string;
}

export function RecipeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { categories } = useRecipeCategories();

  const categoryNames = categories.slice(1).map((category) =>
    category.name
      .slice(2)
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );

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
            }}
          >
            Filters
          </Button>
        )}
        <Button
          startIcon={<SwapVertIcon />}
          onClick={(event) => setRatingAnchor(event.currentTarget)}
          color={ratingOpen ? 'primary' : 'secondary'}
          sx={{
            border: 1,
            borderColor: 'currentColor',
          }}
        >
          Rating
        </Button>

        <Button
          startIcon={<SwapVertIcon />}
          onClick={(event) => setDateAnchor(event.currentTarget)}
          color={dateOpen ? 'primary' : 'secondary'}
          sx={{
            border: 1,
            borderColor: 'currentColor',
          }}
        >
          Date
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
            Dish type
          </Typography>

          {categoryNames.map((category, index) => (
            <Box key={category}>
              {index !== 0 && <Divider />}

              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={category}
                    control={
                      <Checkbox
                        checked={field.value.includes(category)}
                        onChange={() => {
                          field.onChange(
                            field.value.includes(category)
                              ? field.value.filter((item) => item !== category)
                              : [...field.value, normalizeCategory(category)]
                          );
                        }}
                      />
                    }
                    sx={{
                      width: '100%',
                      pl: 1,
                    }}
                  />
                )}
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
            Saved
          </Typography>

          <Controller
            name="saved"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  label="Saved recipes"
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
                  }}
                />

                <Divider />

                <FormControlLabel
                  label="Unsaved recipes"
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
                label="Highest score first"
              />

              <FormControlLabel
                value="asc"
                control={<Radio />}
                label="Lowest score first"
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
                value="asc"
                control={<Radio />}
                label="Newest first"
              />

              <FormControlLabel
                value="desc"
                control={<Radio />}
                label="Oldest first"
              />
            </RadioGroup>
          )}
        />
      </Menu>
    </>
  );
}
