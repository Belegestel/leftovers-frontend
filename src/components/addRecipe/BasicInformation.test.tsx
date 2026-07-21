import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { BasicInformation } from './BasicInformation';
import { vi, expect, describe, it } from 'vitest';

vi.mock('@/hooks/useRecipeCategories', () => ({
  useRecipeCategories: () => ({
    categories: [{ name: 'Breakfasts' }, { name: 'Dinner' }],
    loading: false,
  }),
}));

function Wrapper() {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      image: null,
      prepTime: 15,
      servings: 1,
    },
  });

  return (
    <FormProvider {...methods}>
      <BasicInformation onNext={vi.fn()} />
    </FormProvider>
  );
}

describe('BasicInformation', () => {
  it('does not upload invalid file type', () => {
    render(<Wrapper />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
