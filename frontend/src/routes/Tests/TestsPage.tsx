import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем Link для создания ссылок
import styles from './TestPage.module.scss';
import { Button } from 'antd';
import axios from 'axios';

export const TestsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const getTests = useCallback(
    () => async () => {
      try {
        const response = await axios.get('/api/tests');
        if (response.status === 200) {
          setTests(response.data);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    },
    []
  );

  useEffect(() => {
    getTests();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Tests Page</h1>
      <div className={styles.tests}>
        {tests?.length > 0
          ? tests.map((test, index) => (
              <div key={index}>
                {/* Создаем ссылку на страницу с подробностями теста */}
                <Link to={`/test/${test._id}`}>{test.name}</Link>
              </div>
            ))
          : 'No tests found'}
      </div>

      {/* Добавляем кнопку для перехода на страницу добавления теста */}
      <Button onClick={() => navigate('/add-test')}>Add New Test</Button>
    </div>
  );
};
