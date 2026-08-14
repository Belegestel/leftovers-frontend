import { expect, describe, it } from 'vitest';
import Recipes from './Recipes';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
describe('Recipes', () => {
  it('displays all recipes title for the all recipes mode', async () => {
    const client = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Recipes mode="all" />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText('All Recipes')).toBeInTheDocument();
    expect(screen.queryByText('Saved Recipes')).not.toBeInTheDocument();
    expect(screen.queryByText('My Recipes')).not.toBeInTheDocument();
  });

  it('displays all recipes title for the saved recipes mode', async () => {
    const client = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Recipes mode="saved" />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText('All Recipes')).not.toBeInTheDocument();
    expect(await screen.findByText('Saved Recipes')).toBeInTheDocument();
    expect(screen.queryByText('My Recipes')).not.toBeInTheDocument();
  });

  it('displays all recipes title for the own recipes mode', async () => {
    const client = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Recipes mode="my" />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText('All Recipes')).not.toBeInTheDocument();
    expect(screen.queryByText('Saved Recipes')).not.toBeInTheDocument();
    expect(await screen.findByText('My Recipes')).toBeInTheDocument();
  });
});
