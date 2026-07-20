import { useState } from 'react';
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
import { createRecipeWithImage, editRecipe } from '@/services/recipeService';

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

    const recipe = await createRecipeWithImage(
      {
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
      },
      values.image
    );
    return recipe.id;
  };

  const handleEditVisibility = async (
    recipeId: number,
    isPrivate: boolean
  ): Promise<void> => {
    await editRecipe(recipeId, { isPublic: !isPrivate });
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
              onSavePrivate={() => handleSaveRecipe(false)}
              onPublish={() => handleSaveRecipe(true)}
              onChangeVisibility={(recipeId: number, isPrivate: boolean) => handleEditVisibility(recipeId, isPrivate) }
            />
          </Box>
        )}
      </FormProvider>
    </Container>
  );
}
