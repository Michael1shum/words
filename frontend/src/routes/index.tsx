// routes/index.ts
import { createHashRouter, Navigate } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { TestsPage } from './Tests';
import { TestDetailPage } from './Tests/TestDetailPage';
import { AddTestPage } from './Tests/AddTestPage/AddTestPage';
import { Login } from '@/routes/Login/Login';

export const useGetRoutes = (role: string | undefined) => {
  const isAuthenticated = role !== undefined;

  const router = createHashRouter([
    {
      id: 'root',
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'tests',
          element: isAuthenticated ? <TestsPage /> : <Navigate to='/login' replace />,
        },
        {
          path: 'test/:id',
          element: isAuthenticated ? <TestDetailPage /> : <Navigate to='/login' replace />,
        },
        {
          path: 'add-test',
          element: isAuthenticated ? <AddTestPage /> : <Navigate to='/login' replace />,
        },
        { path: 'login', element: <Login /> },
      ],
    },
  ]);

  return { router };
};
