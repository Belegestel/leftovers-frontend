import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmationModal';
import { describe, vi, expect, it } from 'vitest';

describe('ConfirmModal', () => {
  it('calls confirm callback when confirm button is clicked', () => {
    const onConfirm = vi.fn();

    render(
      <ConfirmModal
        open
        title="Delete recipe?"
        message="Are you sure?"
        confirmButton="Delete"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Delete'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls cancel callback when cancel button is clicked', () => {
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        open
        title="Delete recipe?"
        message="Are you sure?"
        confirmButton="Delete"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
