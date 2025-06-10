// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

import NotFound from '@/pages/NotFound';
import SkipSizePage from '@/pages/SkipSizePage';

export const routes = [
  {
    path: '/',
    element: <SkipSizePage />
  },
  {
    path: '/*',
    element: <NotFound />
  }
];

export const router = createBrowserRouter(routes);
