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

interface RecipeCardProps {
  recipe: RecipeSummary;
  variant?: 'default' | 'featured';
  onSave: () => void;
}

export function RecipeCard({
  recipe,
  variant = 'default',
  onSave,
}: RecipeCardProps) {
  const isFeatured = variant === 'featured';

  const imageHeight = isFeatured ? { xs: 280, md: 360 } : 240;

  const image = recipe.imageLink ? (
    <CardMedia
      component="img"
      image={recipe.imageLink}
      alt={recipe.title}
      sx={{
        height: imageHeight,
        objectFit: 'cover',
      }}
    />
  ) : (
    <Box
      sx={{
        height: imageHeight,
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

  if (isFeatured) {
    return (
      <Card>
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
            {image}

            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            >
              <SaveRecipeButton onSave={onSave} />
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
            <Typography variant="overline" sx={{color: 'primary.main', fontWeight: 600, fontSize: 16}}>
              RECIPE OF THE DAY
            </Typography>

            <RecipeRating rating={recipe.rating} featured />

            <Typography
              variant="h3"
              sx={{
                mt: 1,
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

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 3,
              }}
            >
              <Typography>
                PREPARATION TIME: {recipe.prepTime} MINUTES
              </Typography>

              <Divider orientation="vertical" flexItem />

              <Typography>{recipe.servings} SERVINGS</Typography>
            </Box>

            <Link
              href="#"
              color="primary"
              sx={{
                mt: 6,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View the recipe &gt;
            </Link>
          </CardContent>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {image}

        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <SaveRecipeButton onSave={onSave} />
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

        <Box sx={{mt: 2}}>
          <RecipeRating rating={recipe.rating} />
        </Box>
      </CardContent>
    </Card>
  );
}
