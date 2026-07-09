import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './app/router';
import './index.css';
import { AppProviders } from './app/providers';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
ReactDOM.createRoot(rootElement).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>,
);
