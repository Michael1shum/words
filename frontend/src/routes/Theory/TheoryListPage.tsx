  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import styles from './TheoryPage.module.scss';
  import { Button, Card, List, Typography, Space, message, Popconfirm  } from 'antd';
  import axios from 'axios';
  import { TheoryData } from '@/routes/types';
  import { CloseOutlined } from '@ant-design/icons';

  const { Title, Text } = Typography;

  export const TheoryListPage = () => {
    const navigate = useNavigate();
    const [theories, setTheories] = useState<TheoryData[]>([]);
    const [loading, setLoading] = useState(false);

    const getTheories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/theory');
        setTheories(response.data);
      } catch (error) {
        message.error('Failed to load theories');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const deleteTheory = async (id: string) => {
      try {
        await axios.delete(`/api/theory/${id}`);
        message.success('Материал успешно удален');
        getTheories(); // Обновляем список после удаления
      } catch (error) {
        message.error('Не удалось удалить материал');
        console.error(error);
      }
    };

    useEffect(() => {
      getTheories();
    }, []);

    return (
      <div className={styles.container}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>Теория</Title>

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
            dataSource={theories}
            loading={loading}
            renderItem={(theory) => (
              <List.Item>
                <Card
                  hoverable
                  className={styles.theoryCard}
                  cover={
                    <div className={styles.cardCover}>
                      <Text strong style={{ fontSize: '24px' }}>📚</Text>
                    </div>
                  }
                  actions={[
                    <Popconfirm
                      title="Удалить материал?"
                      description="Вы уверены, что хотите удалить этот материал?"
                      onConfirm={() => deleteTheory(theory._id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <CloseOutlined key="delete" style={{ color: 'red' }} />
                    </Popconfirm>
                  ]}
                >
                  <Link to={`/theory/${theory._id}`}>
                    <Card.Meta
                      title={theory.title}
                    />
                  </Link>
                </Card>
              </List.Item>
            )}
            locale={{ emptyText: 'No materials available' }}
          />

          <Button
            type="primary"
            onClick={() => navigate('/add-theory')}
            style={{ width: '200px' }}
          >
            Добавить
          </Button>
        </Space>
      </div>
    );
  };
