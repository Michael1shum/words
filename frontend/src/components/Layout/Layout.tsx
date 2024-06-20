import React from 'react';
import {Outlet} from 'react-router-dom';
import {useCookies} from "react-cookie";

export const Layout = () => {
  const [cookies] = useCookies(['role']);
  console.log("cookie", cookies.role)
  return (
    <div>
      <Outlet/>
    </div>
  );
};
