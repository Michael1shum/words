import React from 'react';
import { useGetTest } from '@/hooks';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Typography } from 'antd';
import { Question } from '../types';

const getQuestion = (question: Question) => {
  switch (question.controlType) {
    case 'checkbox':
      return (
        <Form.Item name={question.question} label={question.question}>
          <Checkbox.Group>
            <Row gutter={[12, 12]}>
              {question.options.map((option) => (
                <Col key={option}>
                  <Checkbox value={option}>{option}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      );
    case 'input':
      return (
        <Form.Item name={question.question} label={question.question}>
          <Input />
        </Form.Item>
      );
    case 'radio':
      return (
        <Form.Item name={question.question} label={question.question}>
          <Radio.Group>
            <Row gutter={[12, 12]}>
              {question.options.map((option) => (
                <Col key={option}>
                  <Radio value={option}>{option}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>
      );
    default:
      return null;
  }
};

export const TestDetailPage = () => {
  const { testData, isLoading } = useGetTest();
  const [form] = Form.useForm();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography.Title level={1}>{testData?.name}</Typography.Title>
      <Form form={form} onFinish={(values) => console.log('answers', values)} layout={'vertical'}>
        {testData?.questions.map((question: Question) => (
          <div key={question.question}>{getQuestion(question)}</div>
        ))}
        <Button type='primary' onClick={() => form.submit()}>
          ответить
        </Button>
      </Form>
    </>
  );
};
