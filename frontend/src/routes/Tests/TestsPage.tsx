import React, { useState } from 'react';
import axios from 'axios';
import { Button, Col, Input, Row } from 'antd';

export const TestsPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    await axios.post('/auth/login', { email, password });
    setPassword('');
    setEmail('');
  };

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
          questionID: 'id1',
          description: 'Выберите несколько вариантов',
          controlType: 'checkbox',
          options: [
            'ответ 1',
            'ответ 2',
            'ответ 3',
          ],
          answer: 'ответ 1',
        },
      ],
    });
    console.log(data);
  };

  const registration = async () => {
    await axios.post('/api/registration', { email, password });
    setPassword('');
    setEmail('');
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
        <Col>
          <Button type={'primary'} onClick={() => {
            const data = getUsers();
            console.log(data);
          }}>getUsers</Button>
        </Col>
        <Col>
          <Button type={'primary'} onClick={() => {
            registration();
          }}>registration</Button>
        </Col>
        <Col>
          <Button type={'primary'} onClick={() => {
            addTest();
          }}>addTest</Button>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col>
          <Input placeholder={'Введите email'} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Col>
        <Col>
          <Input placeholder={'Введите пароль'} value={password}
                 onChange={(e) => setPassword(e.target.value)} />
        </Col>
      </Row>
    </>
  );
};