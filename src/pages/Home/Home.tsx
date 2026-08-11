import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useBookmark } from '@/hooks/useBookmark';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const {
    recipes,
    setRecipes,
    recipeOfTheDay,
    setRecipeOfTheDay,
    recipesLoading,
  } = useRecipes();
  const { t } = useTranslation();

  const { toggleBookmark } = useBookmark({
    mode: 'list',
    state: { setRecipes, setRecipeOfTheDay },
  });

  return (
    <Container sx={{ mt: 5 }}>
      {recipesLoading ? (
        <Skeleton variant="rectangular" width="100%" height={360} />
      ) : (
        recipeOfTheDay && (
          <RecipeCard
            recipe={recipeOfTheDay}
            variant="featured"
            onBookmarkToggle={() => toggleBookmark(recipeOfTheDay)}
          />
        )
      )}

      <Box
        sx={{
          mt: 6,
          mb: 3,
        }}
      >
        <Typography variant="h5">{t('home.newRecipes')}</Typography>

        <Divider
          sx={{
            mt: 2,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {recipesLoading ? (
          [...Array(8).keys()].map((n) => (
            <Grid key={n} size={{xs:12,sm:6,md:3}}>
            <Skeleton variant='rectangular' width={250} height={300} />
            </Grid>
          ))
        ) : (
          recipes.map((recipe) => (
            <Grid
              key={recipe.id}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <RecipeCard
                recipe={recipe}
                onBookmarkToggle={() => toggleBookmark(recipe)}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
