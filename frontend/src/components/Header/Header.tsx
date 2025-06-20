import styles from '@components/Layout/Layout.module.scss';
import { Button, Form, Input, Layout, Modal, notification } from 'antd';
const { Header: AntHeader } = Layout;
import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthContext } from '@/App';
import { node } from 'webpack';

export const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fromMode, setFormMode] = useState<'login' | 'registration'>('login');
  const { role, updateRole } = useContext(AuthContext);
  const [form] = Form.useForm();
  const roleFromCookie = Cookies.get('role');
  const resetForm = () => {
    form.resetFields();
    setIsModalVisible(false);
    setFormMode('login');
  };
  const handleRegistration = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/registration', { email, password });
      if (response.status === 200) {
        await handleLogin(email, password);
      }
    }catch (error) {
      if(axios.isAxiosError(error)){
        notification.error({ message: error.response.data.message });
      }
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      resetForm();
      const role = Cookies.get('role');
      updateRole(role);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          notification.error({ message: "Неверный email или пароль" });
        } else {
          notification.error({ message: "Ошибка сервера. Попробуйте позже" });
        }
      } else {
        notification.error({ message: "Неизвестная ошибка" });
      }
    }
  };

  const handleLogout = async () => {
    const response = await axios.post('/api/logout');
    if (response.status === 200) {
      resetForm();
      updateRole(undefined);
    }
  };

  const onFinish = (values: { email: string; password: string }) => {
    if (fromMode === 'login') {
      handleLogin(values.email, values.password);
    }
    if (fromMode === 'registration') {
      handleRegistration(values.email, values.password);
    }
  };

  useEffect(() => {
    if (roleFromCookie) {
      updateRole(roleFromCookie);
    } else {
      setIsModalVisible(true);
    }
  }, [roleFromCookie]);

  return (
    <AntHeader className={styles.header}>
      <Button
        type={'text'}
        onClick={() => {
          if (role !== undefined) {
            handleLogout();
          } else {
            setIsModalVisible(true);
          }
        }}
      >
        {role !== undefined ? 'Logout' : 'Login'}
      </Button>
      <Modal
        mask
        centered
        open={isModalVisible}
        onCancel={() => resetForm()}
        title={fromMode === 'login' ? 'Войти' : 'Регистрация'}
        onOk={() => form.submit()}
        okText={fromMode === 'login' ? 'Войти' : 'Регистрация'}
        cancelText={fromMode === 'login' ? 'Регистрация' : 'Закрыть'}
        cancelButtonProps={{
          onClick: () => {
            if (fromMode === 'login') {
              setFormMode('registration');
            } else {
              resetForm();
              setFormMode('login');
            }
          },
        }}
      >
        <Form
          layout='vertical'
          onFinish={(values) => onFinish(values)}
          form={form}
        >
          <Form.Item name={'email'}>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item name={'password'}>
            <Input placeholder='Password' type={'password'} />
          </Form.Item>
        </Form>
      </Modal>
    </AntHeader>
  );
};
