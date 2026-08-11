import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import RecipeDetails from '@/pages/RecipeDetails/RecipeDetails';
import Recipes from '@/pages/Recipes/Recipes';
import { ProtectedRoute } from './ProtectedRoute';
import RecipeForm from '@/pages/RecipeForm/RecipeForm';
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
      { path: 'add-recipe', element: <RecipeForm /> },
      { path: 'edit-recipe/:recipe', element: <RecipeForm /> },
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
