import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginPage.module.scss';
import {Button, Input} from "antd";
import { useNavigate  } from 'react-router-dom';
// import text from 'src/assets/text/login.json';


export const  LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    await axios.post('/auth/login', { email, password });
    setPassword('');
    setEmail('');
    navigate('/tests');
  };

  const registration = async () => {
    await axios.post('/api/registration', { email, password });
    setPassword('');
    setEmail('');
  };

  return(
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>Login</div>
        <Input
          className ={styles.loginInput}
          placeholder={'Введите email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input className={styles.loginInput}
               type = "password"
               background-color ='red'
               placeholder={'Введите пароль'}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
        />
        <div className = {styles.buttonsContainer}>
          <Button
            className={styles.loginButton}
            onClick={() => {
              login();
            }}
          >
            Login
            {/*{text.buttons.login}*/}
          </Button>
          <Button
            className = {styles.signUpButton}
            onClick={() => {
              registration();
            }}
          >
            Sign up
          </Button>
        </div>

    </div>
    </div>
  );
};
