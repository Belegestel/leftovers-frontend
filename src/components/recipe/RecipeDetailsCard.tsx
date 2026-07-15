import { Box, Card, CardMedia, Divider, Link, Typography } from '@mui/material';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import type { Recipe } from '@/types/recipe';
import { SaveRecipeButton } from './SaveRecipeButton';
import { RecipeRating } from './RecipeRating';

interface RecipeDetailsCardProps {
  recipe: Recipe;
  onBookmarkToggle: (recipe: Recipe) => void;
}

export function RecipeDetailsCard({
  recipe,
  onBookmarkToggle,
}: RecipeDetailsCardProps) {
  const image = recipe.imageLink ? (
    <CardMedia
      component="img"
      image={recipe.imageLink}
      alt={recipe.title}
      sx={{
        aspectRatio: '1 / 1',
        objectFit: 'cover',
        borderRadius: 2,
      }}
    />
  ) : (
    <Box
      sx={{
        aspectRatio: '1 / 1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <DinnerDiningIcon
        sx={{
          fontSize: 70,
          color: 'text.secondary',
        }}
      />
    </Box>
  );

  return (
    <Card
      sx={{
        p: 4,
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'block',
            md: 'grid',
          },
          gridTemplateColumns: '1fr 2fr',
          gap: 5,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ aspectRatio: '1 / 1' }}>{image}</Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', pl: 5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <SaveRecipeButton
              bookmarked={recipe.isBookmarked}
              onToggle={() => onBookmarkToggle(recipe)}
              variant="button"
            />
          </Box>

          <Box sx={{display:'flex',justifyContent:'flex-start', width:'100%'}}>
          <Link
            component="button"
            underline="hover"
            sx={{
              mt: 2,
              p: 0,
              border: 0,
              background: 'none',
              color: 'primary.main',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Rate the recipe
          </Link>
          </Box>

          <RecipeRating
            rating={recipe.rating}
            ratingCount={recipe.ratingCount}
            featured
          />

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mt: 4,
              }}
            >
              {recipe.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              {recipe.description}
            </Typography>

            <Typography
              sx={{
                mt: 3,
              }}
            >
              PREPARATION TIME: {recipe.prepTime} MINUTES
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: {
            xs: 'block',
            md: 'grid',
          },
          gridTemplateColumns: '1fr 2fr',
          gap: 5,
          mt: 5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            Ingredients
          </Typography>

          <Box>
            {recipe.ingredients.map((ingredient) => (
              <Typography
                key={ingredient}
                sx={{
                  mt: 1.5,
                }}
              >
                {ingredient}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box sx={{ pl: 5 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
            }}
          >
            Preparation
          </Typography>

          {recipe.steps.map((step, index) => (
            <Box key={step}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  color: 'primary.main',
                }}
              >
                STEP {index + 1}
              </Typography>

              <Typography
                sx={{
                  mb: 1,
                }}
              >
                {step}
              </Typography>

              {index !== recipe.steps.length - 1 && <Divider sx={{ mb: 1 }} />}
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
