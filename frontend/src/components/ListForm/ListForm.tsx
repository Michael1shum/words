import { Form, Row, Col, Button, FormProps } from 'antd';
import FormList from 'antd/es/form/FormList';
import Input from 'antd/es/input/Input';
import React, { FC } from 'react';

export interface ListFormProps {
  onFinish: FormProps['onFinish'];
}

export const ListForm: FC<ListFormProps> = ({ onFinish }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} onFinish={onFinish}>
      <FormList name='data' initialValue={['']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row gutter={16} key={field.key}>
                <Col span={5}>
                  <Form.Item label='Слово' name={[field.name, 'word']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label='Перевод' name={[field.name, 'translation']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}>
                  <Button type='link' onClick={() => add()}>
                    Добавить
                  </Button>
                </Col>
              </Row>
            ))}
          </>
        )}
      </FormList>
      <Button type='primary' htmlType='submit'>
        Отправить
      </Button>
    </Form>
  );
};
