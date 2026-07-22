import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import RecipeDetails from '@/pages/RecipeDetails/RecipeDetails';
import Recipes from '@/pages/Recipes/Recipes';
import { ProtectedRoute } from './ProtectedRoute';
import AddRecipe from '@/pages/AddRecipe/AddRecipe';
import { RootLayout } from '@/layouts/RootLayout';

const children = [
  { index: true, element: <Home /> },
  { path: 'recipes', element: <Recipes mode={'all'} /> },
  { path: 'recipes/:id', element: <RecipeDetails /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: 'saved', element: <Recipes mode={'saved'} /> },
      { path: 'my-recipes', element: <Recipes mode={'my'} /> },
      { path: 'add-recipe', element: <AddRecipe /> },
      { path: 'edit-recipe/:recipe', element: <AddRecipe /> },
    ],
  },
];

export const router = createBrowserRouter([
  {
    path: '/:lang?',
    element: <RootLayout />,
    children,
  },
]);
