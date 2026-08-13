import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import { RecipeRating } from './RecipeRating';
import { SaveRecipeButton } from './SaveRecipeButton';
import type { RecipeSummary } from '@/types/recipe';
import CreateIcon from '@mui/icons-material/Create';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

interface RecipeCardProps {
  recipe: RecipeSummary;
  variant?: 'default' | 'featured' | 'own';
  onBookmarkToggle: () => void;
  isPrivate?: boolean;
}

export function RecipeCard({
  recipe,
  variant = 'default',
  onBookmarkToggle,
  isPrivate,
}: RecipeCardProps) {
  const isFeatured = variant === 'featured';
  const isOwnedByUser = variant === 'own';
  const navigate = useLocalizedNavigate();

  const imageHeight = isFeatured ? { xs: 280, md: 360 } : undefined;

  const { t } = useTranslation();

  const image = recipe.imageLink ? (
    <CardMedia
      component="img"
      image={recipe.imageLink}
      alt={recipe.title}
      sx={{
        height: imageHeight,
        aspectRatio: isFeatured ? undefined : '4 / 3',
        objectFit: 'cover',
      }}
    />
  ) : (
    <Box
      sx={{
        height: imageHeight,
        aspectRatio: isFeatured ? undefined : '4 / 3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey.100',
      }}
    >
      <DinnerDiningIcon
        sx={{
          fontSize: isFeatured ? 70 : 50,
          color: 'grey.400',
        }}
      />
    </Box>
  );

  const saveButton = (
    <SaveRecipeButton
      bookmarked={recipe.isBookmarked}
      onToggle={onBookmarkToggle}
    />
  );

  if (isFeatured) {
    return (
      <Card
        sx={{
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.025)',
            boxShadow: 6,
          },
          '& :hover .image': {
            transform: 'scale(1.025) translateX(-5px)',
          },
          '& .image': {
            transition: 'transform 200ms ease',
          },
        }}
      >
        <Box
          sx={{
            display: {
              xs: 'block',
              md: 'grid',
            },
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <Box className="image">{image}</Box>

            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            >
              {saveButton}
            </Box>
          </Box>

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 4,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {t('recipeCard.recipeOfTheDay').toUpperCase()}
            </Typography>

            <RecipeRating
              rating={recipe.rating}
              ratingCount={recipe.ratingCount}
              featured
            />

            <Typography variant="h3" sx={{ mt: 1 }}>
              {recipe.title}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {recipe.description}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 3,
              }}
            >
              <Typography>
                {t('recipeCard.prepTime', { time: recipe.prepTime })}
              </Typography>

              <Divider orientation="vertical" flexItem />

              <Typography>
                {t('recipeCard.servings', { count: recipe.servings })}
              </Typography>
            </Box>

            <Link
              component="button"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              color="primary"
              sx={{
                mt: 6,
                fontWeight: 600,
                textDecoration: 'none',
                alignSelf: 'flex-start',
                p: 0,
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
                  transition: 'transform 200ms ease'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              {t('recipeCard.view')} &gt;
            </Link>
          </CardContent>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      sx={{
        maxWidth: 300,
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.025)',
          boxShadow: 6,
        },
        '& :hover .image': {
          transform: 'scale(1.05)',
        },
        '& .image': {
          transition: 'transform 200ms ease',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Box className="image">{image}</Box>

        {isOwnedByUser && isPrivate && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'privateOverlay.main',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <LockIcon sx={{ color: 'white' }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 700,
              }}
            >
              {t('recipeCard.private')}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          {saveButton}
        </Box>
      </Box>

      <CardContent>
        <Typography variant="h5">{recipe.title}</Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {recipe.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <RecipeRating
            rating={recipe.rating}
            ratingCount={recipe.ratingCount}
          />
        </Box>

        {isOwnedByUser && (
          <Box>
            <Link
              underline="hover"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/edit-recipe/${recipe.id}`);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography>{t('recipeCard.edit')}</Typography>
                <CreateIcon sx={{ pb: 0.5, fontSize: 32 }} />
              </Box>
            </Link>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
