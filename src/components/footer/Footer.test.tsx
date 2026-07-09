import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Footer', () => {
  it('renders footer information', () => {
    render(<Footer />);
    expect(screen.getByText('contact@leftovers.com')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
  });
});
