import React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Checkbox,
  Select,
  FormInstance,
  FormListFieldData,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Test } from '@/routes/types';
import { getCheckBoxField } from '@/routes/Tests/AddTestPage/utils';

export const AddTestPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: { name: string; description: string; questions: any[] }) => {
    console.log('Received values of form: ', values);
    const formattedValues = {
      name: values.name,
      description: values.description,
      questions: values.questions.map((question) => ({
        controlType: question.controlType,
        question: question.question,
        description: question.description,
        options: question.options,
        answer: question.answers,
      })),
    };

    axios
      .post('api/tests/add', formattedValues, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Ответ сервера:', response.data);
        alert('Тест успешно добавлен!');
      })
      .catch((error) => {
        console.error('Ошибка при отправке запроса:', error);
        alert('Произошла ошибка при добавлении теста. Проверьте консоль для подробностей.');
      })
      .finally(() => form.resetFields());
  };

  return (
    <>
      <Typography.Title level={1}>Добавление теста</Typography.Title>
      <Row>
        <Col span={12}>
          <Form layout={'vertical'} form={form} onFinish={onFinish}>
            <Col span={12}>
              <Form.Item name='name' label='Название теста'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='description' label='Описание теста'>
                <Input />
              </Form.Item>
            </Col>
            <Form.List
              name='questions'
              initialValue={[
                { controlType: 'input', question: '', description: '', options: [], answers: [] },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={field.key} gutter={[0, 12]}>
                      <Col span={24}>
                        <Row justify={'space-between'}>
                          <Typography.Text>{`Вопрос ${index + 1}`}</Typography.Text>
                          {fields.length > 1 ? (
                            <Button onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                          ) : null}
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Form.Item name={[field.name, 'question']} noStyle required={true}>
                          <Input placeholder='Вопрос' />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name={[field.name, 'description']} noStyle>
                          <Input placeholder='Описание вопроса' />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Row>
                          <Col span={24}>
                            <Form.Item name={[field.name, 'controlType']}>
                              <Select
                                placeholder='Тип вопроса'
                                options={[
                                  { value: 'checkbox', label: 'Множественный выбор ответов' },
                                  { value: 'radio', label: 'Единичный выбор' },
                                  { value: 'input', label: 'Ввод значения' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              shouldUpdate={(prevValues, currentValues) => {
                                return (
                                  prevValues.questions?.[field.name]?.controlType !==
                                  currentValues.questions?.[field.name]?.controlType
                                );
                              }}
                            >
                              {() => {
                                const controlType = form.getFieldValue([
                                  'questions',
                                  field.name,
                                  'controlType',
                                ]);
                                switch (controlType) {
                                  case 'checkbox':
                                    return getCheckBoxField(form, field);
                                    break;
                                  default:
                                    return null;
                                }
                              }}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Col span={8}>
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() =>
                          add({
                            controlType: 'input',
                            question: '',
                            description: '',
                            options: [],
                            answers: [],
                          })
                        }
                        icon={<PlusOutlined />}
                      >
                        Добавить вопрос
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
            <Col span={4}>
              <Button
                type={'primary'}
                onClick={() => {
                  form.submit();
                }}
              >
                Сохранить
              </Button>
            </Col>
          </Form>
        </Col>
      </Row>
    </>
  );
};
