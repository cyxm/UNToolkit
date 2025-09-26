import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/ui/page/app/App.js';
import Home from '@/ui/page/home/Home.js';
import Cmd from '@/ui/page/home/cmd/Cmd.js';
import Db from '@/ui/page/home/db/Db.js';
import Api from '@/ui/page/home/api/Api.js';
import Draw from '@/ui/page/home/draw/Draw.js';

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
            path: 'db',
            element: <Db />
          },
          {
            path: 'api',
            element: <Api />
          },
          {
            path: 'draw',
            element: <Draw />
          }
        ]
      }
    ]
  }
]);
