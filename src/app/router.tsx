import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import Home from '@/pages/Home/Home';
import RecipeDetails from '@/pages/RecipeDetails/RecipeDetails';
import Recipes from '@/pages/Recipes/Recipes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipes', element: <Recipes mode={'all'} /> },
      { path: 'saved', element: <Recipes mode={'saved'} /> },
      { path: 'recipes/:id', element: <RecipeDetails /> },
    ],
  },
]);
