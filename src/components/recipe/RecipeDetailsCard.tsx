import { Box, Card, CardMedia, Divider, Link, Typography } from '@mui/material';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import type { Recipe } from '@/types/recipe';
import { SaveRecipeButton } from './SaveRecipeButton';
import { RecipeRating } from './RecipeRating';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

interface RecipeDetailsCardProps {
  recipe: Recipe;
  onBookmarkToggle: (recipe: Recipe) => void;
  onRate: () => void;
}

export function RecipeDetailsCard({
  recipe,
  onBookmarkToggle,
  onRate,
}: RecipeDetailsCardProps) {
  const { t } = useTranslation();
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
        <Box
          sx={{
            aspectRatio: '1 / 1',
            '&:hover .MuiCardMedia-img': {
              transform: 'translateY(-5px)',
              boxShadow: 6,
            },
            '& .MuiCardMedia-img': {
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            },
          }}
        >
          {image}
        </Box>

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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <Link
              component="button"
              underline="none"
              onClick={onRate}
              sx={{
                mt: 2,
                p: 0,
                border: 0,
                background: 'none',
                color: 'primary.main',
                fontWeight: 700,
                mb: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'currentColor',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  transform: 'scaleX(0)',
                  transition: 'transform 200ms ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              {recipe.userRating ? (
                <>
                  {' '}
                  <CheckIcon fontSize="small" /> {t('recipeCard.rated')}{' '}
                </>
              ) : (
                t('recipeCard.notRated')
              )}
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
              {t('recipeCard.prepTime', {
                time: recipe.prepTime,
              }).toUpperCase()}
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
            {t('recipeCard.ingredients')}
          </Typography>

          <Box>
            {recipe.ingredients.map((ingredient) => (
              <Typography
                key={ingredient}
                sx={{
                  mt: 1.5,
                  '&:hover': {
                    transform: 'translateX(5px)',
                  },
                  transition: 'transform 100ms linear',
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
            {t('recipeCard.prep')}
          </Typography>

          {recipe.steps.map((step, index) => (
            <Box
              key={step}
              sx={{
                '&:hover': {
                  transform: 'translateX(5px)',
                },
                transition: 'transform 100ms linear',
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  color: 'primary.main',
                }}
              >
                {t('recipeCard.stepNum', { index: index + 1 })}
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
