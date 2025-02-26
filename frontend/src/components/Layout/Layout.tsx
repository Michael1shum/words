import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Button, Menu, Dropdown, MenuProps } from 'antd';
import styles from './Layout.module.scss';

const { Header, Sider, Content, Footer } = AntLayout;
type MenuItem = Required<MenuProps>['items'][number];

export const Layout = () => {
  const navigate = useNavigate();

  const items: MenuItem[] = [{ key: '1', label: 'Тесты', onClick: () => navigate('/tests') }];

  return (
    <AntLayout>
      {/* Header */}
      <Header className={styles.header}>
        <Link to='/login' className={styles.headerButton}>
          Login
        </Link>
      </Header>

      <AntLayout>
        {/* Sidebar */}
        <Sider>
          <Menu mode='inline' theme='dark' items={items} />
        </Sider>

        {/* Main content */}
        <AntLayout>
          <Content className={styles.content}>
            <Outlet />
          </Content>
          <Footer className={styles.footer}>© 2024 My Application</Footer>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};
