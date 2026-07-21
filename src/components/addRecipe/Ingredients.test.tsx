import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Ingredients } from './Ingredients';
import { describe, vi, it, expect } from 'vitest';

function Wrapper() {
  const methods = useForm({
    defaultValues: {
      ingredients: [
        { value: 'Food' },
        { value: 'Willpower' },
        { value: 'Time' },
      ],
    },
  });

  return (
    <FormProvider {...methods}>
      <Ingredients
        onBack={vi.fn()}
        onNext={vi.fn()}
      />
    </FormProvider>
  );
}

describe('Ingredients', () => {

  it('adds a new ingredient field', () => {
    render(<Wrapper />);

    fireEvent.click(
      screen.getByText('+ Add a new ingredient')
    );
    expect(
      screen.getByLabelText('Ingredient #4')
    ).toBeInTheDocument();
  });

  it('allows going next only when ingredients are filled', () => {
    render(<Wrapper />);
    expect(
      screen.getByText('Next >')
    ).toBeEnabled();
  });
});
