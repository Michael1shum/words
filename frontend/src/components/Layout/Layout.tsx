import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {useCookies} from "react-cookie";

export const Layout = () => {
  const [cookies] = useCookies(['role']);
  console.log("cookie", cookies.role)
  return (
    <div>
      <div>
        <Link to='/login'>Login</Link>
        <Link to='/tests'>Tests</Link>
      </div>
      <Outlet />
    </div>
  );
};
