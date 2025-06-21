import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import styles from './Layout.module.scss';
import { Header } from '@components/Header';
import { AuthContext } from '@/App';
import { BarChartOutlined, BulbOutlined, HddOutlined, HourglassOutlined } from '@ant-design/icons';

const { Sider, Content, Footer } = AntLayout;

export const Layout = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const items: MenuProps['items'] = [];

  if (role !== undefined) {
    items.push(
      { key: '1', label: 'Теория', onClick: () => navigate('/theory-list'), icon: <HddOutlined /> },
      { key: '2', label: 'Тесты', onClick: () => navigate('/tests'), icon: <HourglassOutlined /> },
      { key: '3', label: 'Результаты тестов', onClick: () => navigate('/tests/results'), icon: <BarChartOutlined /> },
      { key: '4', label: 'Лабораторные', onClick: () => navigate('/labs'), icon: <BulbOutlined /> }
    );
  }

  return (
    <AntLayout>
      <Header />

      <AntLayout>
        <Sider collapsible>
          <Menu mode='inline' theme='dark' items={items} />
        </Sider>

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
