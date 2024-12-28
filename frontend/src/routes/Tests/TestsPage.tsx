import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TestsPage.module.scss';
import { useGetTests } from '../../hooks/useGetTests';

export const TestsPage = () => {
  const { fetchTests, tests } = useGetTests();
  useEffect(() => {
    fetchTests();
  }, []);
  return (
    <div className={styles.container}>
      <h1>Tests Page</h1>
      <div className={styles.tests}>
        {tests?.length > 0
          ? tests.map((test, index) => (
              <Link key={test.id} to={`/tests/${test.id}`}>
                {test.name}
              </Link>
            ))
          : 'No tests found'}
      </div>
    </div>
  );
};
