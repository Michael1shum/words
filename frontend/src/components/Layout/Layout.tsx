import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Button, Menu, Dropdown, MenuProps } from 'antd';
import styles from './Layout.module.scss';
import { Header } from '@components/Header';
import { AuthContext } from '@/App';

const { Sider, Content, Footer } = AntLayout;
type MenuItem = Required<MenuProps>['items'][number];

export const Layout = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const items: MenuItem[] =
    role !== undefined ? [{ key: '1', label: 'Тесты', onClick: () => navigate('/tests') }] : [];

  return (
    <AntLayout>
      <Header />

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
