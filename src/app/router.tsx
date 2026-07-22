import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import Home from '@/pages/Home/Home';
import RecipeDetails from '@/pages/RecipeDetails/RecipeDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipes/:id', element: <RecipeDetails /> },
    ],
  },
]);
