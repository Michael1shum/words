import { createHashRouter, Navigate } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { TestsPage } from './Tests';
import { TestDetailPage } from './Tests/TestDetailPage';
import { AddTestPage } from './Tests/AddTestPage/AddTestPage';
import { Login } from '@/routes/Login/Login';
import { LabsPage } from './Labs/LabsPage';
import { Lab1 } from './Labs/Lab1/Lab1';  // Страница лабораторной работы 1

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
        {
          path: 'labs',  // Новый путь для лабораторий
          element: isAuthenticated ? <LabsPage /> : <Navigate to='/login' replace />,
        },
        {
          path: 'labs/1',  // Страница лабораторной работы 1
          element: isAuthenticated ? <Lab1 /> : <Navigate to='/login' replace />,
        },
        { path: 'login', element: <Login /> },
      ],
    },
  ]);

  return { router };
};
