// routes/index.ts
import { createHashRouter } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { TestsPage } from './Tests';
import { TestDetailPage } from './Tests/TestDetailPage'; // Импортируем компонент для отображения полного теста
import { AddTestPage } from './Tests/AddTestPage/AddTestPage';

export const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    Component: Layout,
    children: [
      { path: 'tests', Component: TestsPage },
      { path: 'test/:id', Component: TestDetailPage }, // Новый маршрут для отображения теста по ID
      { path: 'add-test', Component: AddTestPage },
    ],
  },
]);
