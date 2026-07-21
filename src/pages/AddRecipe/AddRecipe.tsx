import { useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { FormProvider, useForm } from 'react-hook-form';
import { BasicInformation } from '@/components/addRecipe/BasicInformation';
import type { AddRecipeFormValues } from '@/types/addRecipe';
import { Ingredients } from '@/components/addRecipe/Ingredients';
import { PreparationMethod } from '@/components/addRecipe/PreparationMethod';
import { Publication } from '@/components/addRecipe/Publication';
import {
  createRecipeWithImage,
  deleteRecipe,
  editRecipe,
  getRecipe,
} from '@/services/recipeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '@/components/common/SnackbarProvider';

type AddRecipeStep =
  'basic' | 'ingredients' | 'preparation' | 'publication' | 'loading';

const steps: {
  value: AddRecipeStep;
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

export default function AddRecipe() {
  const [activeStep, setActiveStep] = useState<AddRecipeStep>('basic');
  const [currentRecipeId, setCurrentRecipeId] = useState<number | undefined>();
  const [savedIsPublic, setSavedIsPublic] = useState<boolean | undefined>();

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const { recipe } = useParams();

  const recipeIdFromRoute = recipe ? Number(recipe) : undefined;

  const methods = useForm<AddRecipeFormValues>({
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
          category: recipe.category
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()),
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
        showSnackbar({ message: '❌ Failed to edit the recipe' });
        navigate('/');
      } finally {
        setActiveStep('basic');
      }
    };

    loadRecipe();
  }, [recipeIdFromRoute, reset, navigate, showSnackbar]);

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

  const handleSaveRecipe = async (isPublic: boolean): Promise<number> => {
    const values = methods.getValues();

    const data = {
      title: values.title,
      description: values.description,
      category:
        values.category.toLowerCase() === 'breakfasts'
          ? 'BREAKFAST'
          : values.category.toUpperCase(),
      prepTime: values.prepTime ?? 0,
      servings: values.servings,
      ingredients: values.ingredients.map((ingredient) => ingredient.value),
      steps: values.steps.map((step) => step.value),
      isPublic,
    };

    if (currentRecipeId) {
      await editRecipe(currentRecipeId, data);
      setSavedIsPublic(isPublic);
      reset(methods.getValues());
      return currentRecipeId;
    }

    if (typeof values.image === 'string') {
      throw new Error('Something went wrong');
    }

    const recipe = await createRecipeWithImage(data, values.image);

    setCurrentRecipeId(recipe.id);
    setSavedIsPublic(isPublic);

    reset(methods.getValues());

    return recipe.id;
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
          {recipeIdFromRoute ? 'Edit Recipe' : 'Add Recipe'}
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
              onSave={handleSaveRecipe}
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
      </FormProvider>
    </Container>
  );
}
