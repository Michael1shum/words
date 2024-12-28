import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginPage.module.scss';
import {Button, Input} from "antd";
import { useNavigate  } from 'react-router-dom';
import showIcon from './icons/show_icon.png';
import hideIcon from './icons/hide_icon.png';
// import text from 'src/assets/text/login.json';


export const  LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    await axios.post('/auth/login', { email, password });
    setPassword('');
    setEmail('');
    navigate('/tests');
  };

  const registration = async () => {
    console.log("Регистрация полетела на api/registration")
    await axios.post('/api/registration', { email, password });
    setPassword('');
    setEmail('');
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
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
        <div className={styles.passwordContainer}>
          <input
            className={styles.passwordInput}
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className={styles.toggleButton}
            onClick={toggleShowPassword}
            type="button"
          >
            <img className={styles.imageIcon}
                 src={showPassword ? hideIcon : showIcon}
                 alt="toggle password visibility" />
          </button>
        </div>
        <div className = {styles.buttonsContainer}>
          <Button
            className={styles.loginButton}
            onClick={() => {
              login();
            }}
          >
            Login
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
