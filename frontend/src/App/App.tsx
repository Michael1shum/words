import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';
import '../assets/global.scss';

export const App = () => {
  return (
    <RouterProvider router={router} />
  );
};
