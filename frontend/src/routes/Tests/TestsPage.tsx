    import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TestPage.module.scss';
import { Button, Card, List, Typography, Space, message, Popconfirm  } from 'antd';
import axios from 'axios';
import { AuthContext } from '@/App';
import { CloseOutlined } from '@ant-design/icons';

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

  const deleteTest = async (testId: string) => {
    try {
      await axios.delete(`/api/tests/${testId}`);
      message.success('Test deleted successfully');
      getTests(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting test:', error);
      message.error('Failed to delete test');
    }
  };

  useEffect(() => {
    if (role) {
      getTests();
    } else {
      setTests([]);
    }
  }, [role, getTests]);

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Доступные тесты</Title>

        {tests?.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
            dataSource={tests}
            loading={loading}
            renderItem={(test) => (
              <List.Item>
                <Card
                  hoverable
                  className={styles.testCard}
                  cover={
                    <div className={styles.cardCover}>
                      <Text strong style={{ fontSize: '24px' }}>📝</Text>
                    </div>
                  }
                  actions={[
                    <Popconfirm
                      title="Удалить тест?"
                      description="Вы уверены, что хотите удалить этот тест?"
                      onConfirm={() => deleteTest(test._id)}
                      okText="Да"
                      cancelText="Нет"
                      key="delete"
                    >
                      <CloseOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                  ]}
                >
                  <Link to={`/test/${test._id}`}>
                    <Card.Meta
                      title={test.name}
                      description={
                        <Text type="secondary" ellipsis>
                          {test.description || 'Нет описания'}
                        </Text>
                      }
                    />
                  </Link>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Card>
            <Text type="secondary">No tests available</Text>
          </Card>
        )}
          <Button
            type="primary"
            onClick={() => navigate('/add-test')}
            style={{ width: '200px' }}
          >
            Добавить новый тест
          </Button>
      </Space>
    </div>
  );
};
