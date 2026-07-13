import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveRecipeButton } from './SaveRecipeButton';

describe('SaveRecipeButton', () => {
  it('renders an empty bookmark when recipe is not bookmarked', () => {
    render(<SaveRecipeButton bookmarked={false} onToggle={() => {}} />);

    expect(screen.getByRole('button')).toBeInTheDocument();

    expect(screen.getByTestId('BookmarkBorderIcon')).toBeInTheDocument();
  });

  it('renders a filled bookmark when recipe is bookmarked', () => {
    render(<SaveRecipeButton bookmarked={true} onToggle={() => {}} />);

    expect(screen.getByTestId('BookmarkIcon')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<SaveRecipeButton bookmarked={false} onToggle={onToggle} />);

    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
