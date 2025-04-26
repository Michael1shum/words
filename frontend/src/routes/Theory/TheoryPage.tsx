import React, { useState, useEffect } from 'react';
import { Button, Spin, message, Typography, Tag } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TheoryPage.module.scss';
import { TheoryData } from '@/routes/types';

const { Title, Text } = Typography;

export const TheoryPage = () => {
  const [theory, setTheory] = useState<TheoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/theory/${id}`);
        setTheory(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            message.error('Material not found');
            navigate('/theory-list');
          } else {
            message.error('Error loading material');
          }
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTheory();
  }, [id, navigate]);

  if (loading) {
    return <Spin size="large" className={styles.spin} />;
  }

  if (!theory) {
    return (
      <div className={styles.container}>
        <Text type="danger">Material not found</Text>
        <Button onClick={() => navigate('/theory-list')}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>{theory.title}</Title>
        {theory.category && <Tag color="blue">{theory.category}</Tag>}
      </div>

      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: theory.content }} />
      </div>

      <div className={styles.footer}>
        <Link to="/theory-list">
          <Button>Back to list</Button>
        </Link>
      </div>
    </div>
  );
};
