import { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
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

type AddRecipeStep = 'basic' | 'ingredients' | 'preparation' | 'publication';

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
  const [isEditPublic, setIsEditPublic] = useState<null | boolean>();

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const { recipe } = useParams();
  const recipeId = recipe ? Number(recipe) : undefined;

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
  } = methods;

  useEffect(() => {
    if (!recipeId) {
      return;
    }

    const loadRecipe = async () => {
      try {
        const recipe = await getRecipe(recipeId);

        if (!recipe) {
          navigate('/add-recipe');
        }

        methods.reset({
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
        setIsEditPublic(recipe.isPublic);
      } catch (error) {
        showSnackbar({ message: '❌ Failed to edit the recipe' });
        navigate('/');
      }
    };

    loadRecipe();
  }, [recipeId, methods]);

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

  const handleSaveRecipe = async (
    isPublic: boolean,
    isEdit?: boolean
  ): Promise<number> => {
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

    if (recipeId) {
      await editRecipe(recipeId, data);
      return recipeId;
    }

    if (typeof values.image === 'string') {
      throw new Error('Something went wrong');
    }

    if (isEdit && recipeId !== undefined) {
      await editRecipe(recipeId, {
        title: values.title,
        description: values.description ?? undefined,
        category: values.category ?? undefined,
        prepTime: values.prepTime ?? undefined,
        servings: values.servings ?? undefined,
        ingredients: values.ingredients.map(({ value }) => value) ?? undefined,
        steps: values.steps.map(({ value }) => value) ?? undefined,
        isPublic: values.isPublic ?? undefined,
      });
      return recipeId;
    } else {
      const recipe = await createRecipeWithImage(data, values.image);
      return recipe.id;
    }
  };

  const handleEditVisibility = async (
    recipeId: number,
    isPrivate: boolean
  ): Promise<void> => {
    await editRecipe(recipeId, { isPublic: !isPrivate });
    methods.reset(methods.getValues());
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
          Add Recipe
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
              editRecipeId={isEditPublic !== undefined ? recipeId : undefined}
              isPublic={isEditPublic ?? undefined}
              isDirty={isDirty}
            />
          </Box>
        )}
      </FormProvider>
    </Container>
  );
}
