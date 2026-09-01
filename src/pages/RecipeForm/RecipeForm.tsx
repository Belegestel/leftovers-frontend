import { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { FormProvider, useForm } from 'react-hook-form';
import { BasicInformation } from '@/components/recipeForm/BasicInformation';
import type { RecipeFormValues } from '@/types/recipeForm';
import { Ingredients } from '@/components/recipeForm/Ingredients';
import { PreparationMethod } from '@/components/recipeForm/PreparationMethod';
import { Publication } from '@/components/recipeForm/Publication';
import {
  createRecipeWithImage,
  deleteRecipe,
  editRecipe,
  getRecipe,
  uploadImage,
} from '@/services/recipeService';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '@/components/common/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import type { Recipe } from '@/types/recipe';

type RecipeFormStep =
  'basic' | 'ingredients' | 'preparation' | 'publication' | 'loading';

const steps: {
  value: RecipeFormStep;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'basic',
    label: 'BASIC INFORMATION',
    icon: <InfoOutlinedIcon />,
  },
  {
    value: 'ingredients',
    label: 'INGREDIENTS',
    icon: <LunchDiningOutlinedIcon />,
  },
  {
    value: 'preparation',
    label: 'PREPARATION METHOD',
    icon: <RestaurantMenuOutlinedIcon />,
  },
  {
    value: 'publication',
    label: 'PUBLICATION',
    icon: <LibraryBooksOutlinedIcon />,
  },
];

export default function RecipeForm() {
  const [activeStep, setActiveStep] = useState<RecipeFormStep>('basic');
  const [currentRecipeId, setCurrentRecipeId] = useState<number | undefined>();
  const [savedIsPublic, setSavedIsPublic] = useState<boolean | undefined>();

  const { t } = useTranslation();

  const showSnackbar = useSnackbar();
  const navigate = useLocalizedNavigate();
  const { recipe } = useParams();

  const recipeIdFromRoute = recipe ? Number(recipe) : undefined;

  const methods = useForm<RecipeFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      prepTime: 15,
      servings: 1,
      ingredients: [{ value: '' }, { value: '' }, { value: '' }],
      steps: [{ value: '' }, { value: '' }, { value: '' }],
      image: null,
      isPublic: false,
    },
  });

  const {
    formState: { isDirty },
    reset,
  } = methods;

  useEffect(() => {
    if (!recipeIdFromRoute) {
      return;
    }

    setCurrentRecipeId(recipeIdFromRoute);

    const loadRecipe = async () => {
      setActiveStep('loading');
      try {
        const recipe = await getRecipe(recipeIdFromRoute);

        if (!recipe) {
          navigate('/add-recipe');
          return;
        }

        reset({
          title: recipe.title,
          description: recipe.description,
          category: recipe.category,
          prepTime: recipe.prepTime,
          servings: recipe.servings,
          ingredients: recipe.ingredients.map((ingredient: string) => ({
            value: ingredient,
          })),
          steps: recipe.steps.map((step: string) => ({
            value: step,
          })),
          image: recipe.imageLink,
          isPublic: recipe.isPublic,
        });

        setSavedIsPublic(recipe.isPublic);
      } catch {
        showSnackbar({ message: `❌ ${t('addRecipe.snackbar.editFail')}` });
        navigate('/');
      } finally {
        setActiveStep('basic');
      }
    };

    loadRecipe();
  }, [recipeIdFromRoute, reset, showSnackbar]);

  const goToNextStep = () => {
    setActiveStep((currentStep) => {
      const currentIndex = steps.findIndex(
        (step) => step.value === currentStep
      );

      return steps[currentIndex + 1]?.value ?? currentStep;
    });
  };

  const goToPreviousStep = () => {
    setActiveStep((currentStep) => {
      const currentIndex = steps.findIndex(
        (step) => step.value === currentStep
      );

      return steps[currentIndex - 1]?.value ?? currentStep;
    });
  };

  const handleSaveRecipe = async (isPublic: boolean): Promise<Recipe> => {
    const values = methods.getValues();

    if (typeof values.image === 'string') {
      throw new Error('File upload error');
    }

    const recipe = await createRecipeWithImage(
      {
        title: values.title,
        description: values.description,
        category: values.category,
        prepTime: values.prepTime ?? 0,
        servings: values.servings,
        ingredients: values.ingredients.map((ingredient) => ingredient.value),
        steps: values.steps.map((step) => step.value),
        isPublic,
      },
      values.image
    );
    reset(methods.getValues());
    return recipe;
  };

  const handleEditRecipe = async (
    recipeId: number,
    isPrivate: boolean
  ): Promise<void> => {
    const values = methods.getValues();

    await editRecipe(recipeId, {
      title: values.title,
      description: values.description,
      category: values.category,
      prepTime: values.prepTime ?? 0,
      servings: values.servings,
      ingredients: values.ingredients.map((ingredient) => ingredient.value),
      steps: values.steps.map((step) => step.value),
      isPublic: !isPrivate,
    });
    if (values.image && typeof values.image !== 'string') {
      await uploadImage(recipeId, values.image);
    }
    reset(methods.getValues());
  };

  const handleEditVisibility = async (
    recipeId: number,
    isPrivate: boolean
  ): Promise<void> => {
    await editRecipe(recipeId, { isPublic: !isPrivate });

    setCurrentRecipeId(recipeId);
    setSavedIsPublic(!isPrivate);

    reset(methods.getValues());
  };

  const handleDeleteRecipe = async (recipeId: number): Promise<void> => {
    await deleteRecipe(recipeId);
  };

  return (
    <Container>
      <FormProvider {...methods}>
        <Typography
          variant="h4"
          sx={{
            mt: 4,
            mb: 3,
          }}
        >
          {recipeIdFromRoute ? t('editRecipe.title') : t('addRecipe.title')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {steps.map((step) => {
            const isActive = step.value === activeStep;

            return (
              <Box
                key={step.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 1,
                  pb: 1.5,
                  pl: 2,
                  pr: 2,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  borderBottom: isActive
                    ? '2px solid'
                    : '2px solid transparent',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {step.icon}

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 5,
            pt: 1,
            backgroundColor: 'background.default',
            borderRadius: 3,
          }}
        >
          {activeStep === 'loading' && (
            <Skeleton
              variant="rectangular"
              sx={{ mt: 5, width: '100%', height: 350 }}
            />
          )}
          {activeStep === 'basic' && <BasicInformation onNext={goToNextStep} />}

          {activeStep === 'ingredients' && (
            <Box sx={{ mt: 4 }}>
              <Ingredients onNext={goToNextStep} onBack={goToPreviousStep} />
            </Box>
          )}

          {activeStep === 'preparation' && (
            <Box sx={{ mt: 4 }}>
              <PreparationMethod
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            </Box>
          )}

          {activeStep === 'publication' && (
            <Box sx={{ mt: 4 }}>
              <Publication
                onBack={goToPreviousStep}
                onSavePrivate={() => handleSaveRecipe(false)}
                onPublish={() => handleSaveRecipe(true)}
                onEdit={(recipeId: number, isPrivate: boolean) =>
                  handleEditRecipe(recipeId, isPrivate)
                }
                onChangeVisibility={(recipeId: number, isPrivate: boolean) =>
                  handleEditVisibility(recipeId, isPrivate)
                }
                onRecipeDelete={handleDeleteRecipe}
                recipeId={currentRecipeId}
                isPublic={savedIsPublic}
                isDirty={isDirty}
              />
            </Box>
          )}
        </Box>
      </FormProvider>
    </Container>
  );
}
