import React, {useState} from 'react';
import {Button, Col, Input, Row} from 'antd';
import axios from 'axios';

export const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        await axios.post('/auth/login', {email: 'test@ya.ru', password: '123'});
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

    const registration = async () => {
        await axios.post('/api/registration', {email, password});
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
            </Row>
            <Row gutter={24}>
                <Col>
                    <Input placeholder={'Введите email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Col>
                <Col>
                    <Input placeholder={'Введите пароль'} value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </Col>
            </Row>
        </>
    );
};
