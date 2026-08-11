import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { PreparationMethod } from './PreparationMethod';
import { vi, expect, describe, it } from 'vitest';

function Wrapper() {
  const methods = useForm({
    defaultValues: {
      steps: [{ value: 'Prepare' }, { value: 'Consume' }],
    },
  });

  return (
    <FormProvider {...methods}>
      <PreparationMethod onBack={vi.fn()} onNext={vi.fn()} />
    </FormProvider>
  );
}

describe('PreparationMethod', () => {
  it('adds new preparation step', () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByText('+ Add a new step'));

    expect(screen.getByLabelText('Step 3')).toBeInTheDocument();
  });
});
