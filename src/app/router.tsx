import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import Home from '@/pages/Home/Home';
import RecipeDetails from '@/pages/RecipeDetails/RecipeDetails';
import Recipes from '@/pages/Recipes/Recipes';
import { ProtectedRoute } from './ProtectedRoute';
import AddRecipe from '@/pages/AddRecipe/AddRecipe';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipes', element: <Recipes mode={'all'} /> },
      { path: 'recipes/:id', element: <RecipeDetails /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'saved', element: <Recipes mode={'saved'} /> },
          { path: 'my-recipes', element: <Recipes mode={'my'} /> },
          { path: 'add-recipe', element: <AddRecipe />}
        ],
      },
    ],
  },
]);
