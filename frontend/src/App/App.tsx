import React from 'react';
import { Button, Col, Row } from 'antd';
import axios from 'axios';

export const App = () => {
  const login = async () => {
    await axios.post('/auth/login', { email: 'test@ya.ru', password: '123' });
  };

  const logout = async () => {
    await axios.post('/auth/logout');
  };

  const getTests = async () => {
    const data = await axios.get('/api/tests');
    return data.data;
  };
  return (
    <>
      <Row justify={'center'} gutter={16}>
        <Col>
          <Button type={'primary'} onClick={() => {
            login();
          }}>login</Button>
        </Col>
        <Col>
          <Button type={'primary'} onClick={() => {
            logout();
          }}>logout</Button>
        </Col>
        <Col>
          <Button type={'primary'} onClick={() => {
            const data = getTests();
            console.log(data);
          }}>getTests</Button>
        </Col>
      </Row>
    </>
  );
};
