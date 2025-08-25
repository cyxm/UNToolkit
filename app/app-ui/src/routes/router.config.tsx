import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/page/app/App';
import Home from '@/page/home/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }
]);
