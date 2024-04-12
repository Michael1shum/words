import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <div>
        <Link to='/login-rout'>Login</Link>
        <Link to='/tests-rout'>Tests</Link>
      </div>
      <Outlet />
    </div>
  );
};