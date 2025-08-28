import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/ui/page/app/App.js';
import Home from '@/ui/page/home/Home.js';

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
