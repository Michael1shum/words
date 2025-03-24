import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import styles from './Layout.module.scss';
import { Header } from '@components/Header';
import { AuthContext } from '@/App';

const { Sider, Content, Footer } = AntLayout;

export const Layout = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const items: MenuProps['items'] = [];

  if (role !== undefined) {
    items.push(
      { key: '1', label: 'Тесты', onClick: () => navigate('/tests') },
      { key: '2', label: 'Лабораторные', onClick: () => navigate('/labs') }
    );
  }

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
