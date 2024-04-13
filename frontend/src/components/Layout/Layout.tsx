import React from 'react';
import {Link, Outlet} from 'react-router-dom';

export const Layout = () => {
    return (
        <div>
            <div>
                <Link to='/login'>Login</Link>
                <Link to='/tests'>Tests</Link>
            </div>
            <Outlet/>
        </div>
    );
};