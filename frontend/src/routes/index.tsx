import { createHashRouter, Navigate } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { TestsPage } from './Tests';
import { TestDetailPage } from './Tests/TestDetailPage';
import { AddTestPage } from './Tests/AddTestPage/AddTestPage';
import { Login } from '@/routes/Login/Login';
import { LabsPage } from './Labs/LabsPage';
import { Lab3 } from './Labs/Lab3/Lab3';
import { TheoryPage } from './Theory/TheoryPage';
import { TheoryListPage } from './Theory/TheoryListPage';
import { TheoryAddPage } from './Theory/AddTheoryPage';
import { TestsResultsPage } from '@/routes/Tests/TestsResults/TestsResultsPage'; // Страница лабораторной работы 1

export const useGetRoutes = (role: string | undefined) => {
  const isAuthenticated = role !== undefined;

  const router = createHashRouter([
    {
      id: 'root',
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/theory-list',
          element: isAuthenticated ? <TheoryListPage /> : <Navigate to='/login' replace />,
        },
        {
          path: '/theory/:id',
          element: isAuthenticated ? <TheoryPage /> : <Navigate to='/login' replace />,
        },
        {
          path: '/add-theory', // Добавляем новый маршрут
          element: isAuthenticated ? <TheoryAddPage /> : <Navigate to='/login' replace />,
        },
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
          path: 'labs', // Новый путь для лабораторий
          element: isAuthenticated ? <LabsPage /> : <Navigate to='/login' replace />,
        },
        {
          path: 'tests/results',
          element: isAuthenticated ? <TestsResultsPage /> : <Navigate to='/login' replace />,
        },
        {
          path: 'labs/3', // Страница лабораторной работы 1
          element: isAuthenticated ? <Lab3 /> : <Navigate to='/login' replace />,
        },
        { path: 'login', element: <Login /> },
      ],
    },
  ]);

  return { router };
};
