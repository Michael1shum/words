    import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TestPage.module.scss';
import { Button, Card, List, Typography, Space, message } from 'antd';
import axios from 'axios';
import { AuthContext } from '@/App';

const { Title, Text } = Typography;

export const TestsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useContext(AuthContext);

  const getTests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/tests');
      console.log('response', response)
      if (response.status === 200) {
        setTests(response.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      message.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role) {
      getTests();
    } else {
      setTests([]);
    }
  }, [role]);

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Available Tests</Title>

        {tests?.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
            dataSource={tests}
            loading={loading}
            renderItem={(test) => (
              <List.Item>
                <Link to={`/test/${test._id}`}>
                  <Card
                    hoverable
                    className={styles.testCard}
                    cover={
                      <div className={styles.cardCover}>
                        <Text strong style={{ fontSize: '24px' }}>📝</Text>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={test.name}
                      description={
                        <Text type="secondary" ellipsis>
                          {test.description || 'No description provided'}
                        </Text>
                      }
                    />
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <Card>
            <Text type="secondary">No tests available</Text>
          </Card>
        )}

        {role === 'admin' && (
          <Button
            type="primary"
            onClick={() => navigate('/add-test')}
            style={{ width: '200px' }}
          >
            Add New Test
          </Button>
        )}
      </Space>
    </div>
  );
};
