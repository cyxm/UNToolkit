import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/page/app/App.js';
import Home from '@/page/home/Home.js';
import Graph from '@/page/graph/Graph.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            index: true,
            element: <div>请选择功能</div>
          },
          {
            path: 'graph',
            element: <Graph />
          }
        ]
      }
    ]
  }
]);
