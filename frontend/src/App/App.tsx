import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useGetRoutes } from '../routes';
import '../assets/global.scss';

export const AuthContext = React.createContext({
  role: undefined,
  updateRole: (value: string) => {
    console.log(value);
  },
});

export const App = () => {
  const [role, setRole] = useState<undefined | string>(undefined);
  const { router } = useGetRoutes(role);
  const updateRole = (newRole: string) => {
    setRole(newRole);
  };
  return (
    <AuthContext.Provider value={{ role, updateRole }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};
