import { render, screen, fireEvent } from '@testing-library/react';
import AddRecipe from './AddRecipe';
import { vi, expect, describe, it } from 'vitest';

vi.mock('@/components/addRecipe/BasicInformation', () => ({
  BasicInformation: ({ onNext }: any) => (
    <button onClick={onNext}>Next Basic</button>
  ),
}));

vi.mock('@/components/addRecipe/Ingredients', () => ({
  Ingredients: () => <div>Ingredients step</div>,
}));

vi.mock('@/components/addRecipe/PreparationMethod', () => ({
  PreparationMethod: () => <div>Preparation step</div>,
}));

vi.mock('@/components/addRecipe/Publication', () => ({
  Publication: () => <div>Publication step</div>,
}));

describe('AddRecipe', () => {
  it('moves to ingredients after basic step', () => {
    render(<AddRecipe />);

    fireEvent.click(screen.getByText('Next Basic'));

    expect(screen.getByText('Ingredients step')).toBeInTheDocument();
  });
});
