import React, { useState } from 'react';
import axios from 'axios';
import { Button, Col, Input, Row } from 'antd';
import styles from './TestPage.module.scss';
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const {Header, Footer, Content, Sider} = Layout;

export const TestsPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logout = async () => {
    await axios.post('/auth/logout');
  };

  const getTests = async () => {
    const data = await axios.get('/api/tests');
    return data.data;
  };

  const getUsers = async () => {
    const data = await axios.get('/users/list');
    return data.data;
  };

  const addTest = async () => {
    const data = await axios.post('/api/tests/add', {
      name: 'Test 777',
      questions: [
        {
          description: 'Выберите несколько вариантов',
          controlType: 'checkbox',
          options: ['ответ 1', 'ответ 2', 'ответ 3'],
          answer: 'ответ 1',
        },
      ],
    });
    console.log(data);
  };

  const getAnswerForTest = async () => {
    await axios.post('/api/tests/666eb354412a8fc3b93f34d8/answer', {
      answers: [{ id: '661a68d821e60c64f1a2732f', value: 'ответ 323' }],
    });
  };

  const getTestById = async () => {
    const test = await axios.get('/api/tests/666eb354412a8fc3b93f34d8');
    console.log(test);
  };

  const registration = async () => {
    await axios.post('/api/registration', { email, password });
    setPassword('');
    setEmail('');
  };

    const [collapsed, setCollapsed] = useState(false);

    // Функция для обработки изменения состояния collapse
    const onCollapse = (collapsed: boolean) => {
      setCollapsed(collapsed);
    };

  return (
    <div className={styles.container}>
      <Layout>
        <Header className = {styles.header}>
          <Button
            className = {styles.headerButton}
            onClick={() => {
              logout();
            }}
          >
            logout
          </Button>
          <Button
            className = {styles.headerButton}
            onClick={() => {
              registration();
            }}
          >
            Sign up
          </Button>

        </Header>
        <Layout className = {styles.layout}>
          <Sider
            className= {styles.sider}
            width = {200}
            theme = "dark"
            collapsible
            collapsedWidth={60}
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={null}
          >
            <div>
              {collapsed ? (
                <MenuUnfoldOutlined className={styles.trigger} onClick={() => setCollapsed(!collapsed)} />
              ) : (
                <MenuFoldOutlined className={styles.trigger} onClick={() => setCollapsed(!collapsed)} />
              )}
            </div>
            {!collapsed && (
              <>
            <Button
              className = {styles.siderButton}
              onClick={() => {
                const data = getTests();
                console.log(data);
              }}
            >
              getTests
            </Button>
            <Button
              className = {styles.siderButton}
              onClick={() => {
                const data = getUsers();
                console.log(data);
              }}
            >
              getUsers
            </Button>
            <Button
              className = {styles.siderButton}
              onClick={() => {
                addTest();
              }}
            >
              addTest
            </Button>
              </>
              )}
          </Sider>
          <Content className= {styles.content}>
            {/* Ваш контент */}kontent
          </Content>
        </Layout>



      {/*<Row justify={'center'} gutter={[16, 16]}>*/}
      {/*  <Col>*/}
      {/*    <Button*/}
      {/*      type={'primary'}*/}
      {/*      onClick={() => {*/}
      {/*        getTestById();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      getTestById*/}
      {/*    </Button>*/}
      {/*  </Col>*/}

      {/*  <Col>*/}
      {/*    <Button*/}
      {/*      type={'primary'}*/}
      {/*      onClick={() => {*/}
      {/*        getAnswerForTest();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      getAnswerForTest*/}
      {/*    </Button>*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      </Layout>
    </div>

  );
};
