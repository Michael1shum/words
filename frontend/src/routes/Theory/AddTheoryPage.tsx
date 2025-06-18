// AddTheoryPage.tsx
import React, { useState } from 'react';
import { Button, Form, Input, Select, Switch, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TheoryPage.module.scss';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const TheoryAddPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isHtml, setIsHtml] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await axios.post('/api/theory', {
        ...values,
        isHtml
      });
      message.success('Теория успешно добавлена');
      navigate('/theory-list');
    } catch (error) {
      message.error('Ошибка при добавлении теории');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Добавить теоретический материал</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ category: 'general' }}
      >
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Введите название материала" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Категория"
          rules={[{ required: true, message: 'Выберите категорию' }]}
        >
          <Select>
            <Option value="quantum">Квантовая физика</Option>
            <Option value="optics">Оптика</Option>
            <Option value="general">Общая</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Формат">
          <div style={{ marginBottom: 16 }}>
            <Switch
              checked={isHtml}
              onChange={setIsHtml}
              checkedChildren="HTML"
              unCheckedChildren="Обычный текст"
            />
            <Text type="secondary" style={{ marginLeft: 8 }}>
              {isHtml ? 'HTML-форматирование' : 'Автоматическое форматирование абзацев'}
            </Text>
          </div>
        </Form.Item>

        <Form.Item
          name="content"
          label="Содержание"
          rules={[{ required: true, message: 'Введите содержание' }]}
        >
          <TextArea
            rows={10}
            placeholder={
              isHtml
                ? 'Введите HTML-форматированный текст...'
                : 'Введите текст (будет автоматически разбит на абзацы)...'
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={() => navigate('/theory-list')}
          >
            Отмена
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
