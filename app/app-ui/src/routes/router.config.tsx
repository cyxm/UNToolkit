import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/ui/page/app/App.js';
import Home from '@/ui/page/home/Home.js';
import Cmd from '@/ui/page/home/cmd/Cmd.js';
import Sql from '@/ui/page/home/sql/Sql.js';
import Api from '@/ui/page/home/api/Api.js';

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
            path: 'cmd',
            element: <Cmd />
          },
          {
            path: 'sql',
            element: <Sql />
          },
          {
            path: 'api',
            element: <Api />
          }
        ]
      }
    ]
  }
]);
