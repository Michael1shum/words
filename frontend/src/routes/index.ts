import { createHashRouter } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { LoginPage } from './LoginPage';
import { TestsPage } from './Tests';
import { TestPage } from './Tests/Test/TestPage';

export const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    Component: Layout,
    children: [
      { index: true, path: 'login', Component: LoginPage },
      {
        path: 'tests',
        Component: TestsPage,
        children: [
          { index: true, Component: TestsPage },
          {
            path: ':id',
            Component: TestPage,
          },
        ],
      },
    ],
  },
]);
