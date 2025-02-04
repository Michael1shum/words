import React from 'react';
import { useGetTest } from '../../hooks';
import { Button, Checkbox, Form, Input, Radio, Select, Typography } from 'antd';
import { Question } from '../types';

const getFormItem = (question: Question) => {
  switch (question.controlType) {
    case 'checkbox':
      return (
        <>
          <Typography.Title level={4}>{question.description}</Typography.Title>
          <>
            {question.options.map((option) => (
              <Form.Item key={option} name={[option]}>
                <Checkbox>{option}</Checkbox>
              </Form.Item>
            ))}
          </>
        </>
      );
    case 'select':
      return (
        <Select
          options={question.options.map((item) => {
            return { name: item, value: item };
          })}
        />
      );
    case 'input':
      return <Input />;
    case 'radio':
      return question.options.map((option) => (
        <Form.Item name={option}>
          <Radio />
        </Form.Item>
      ));
  }
};

export const TestDetailPage = () => {
  const { testData, isLoading } = useGetTest();
  const [form] = Form.useForm();
  console.log('testData', testData);

  if (isLoading) {
    return <div>Loading...</div>; // Показываем загрузку
  }

  return (
    <>
      <Typography.Title level={1}>{testData?.name}</Typography.Title>
      <Form form={form} onFinish={(values) => console.log(values)}>
        {testData?.questions.map((question: Question) => getFormItem(question))}
        <Button type={'primary'} onClick={() => form.submit()}>
          Submit
        </Button>
      </Form>
    </>
  );
};
