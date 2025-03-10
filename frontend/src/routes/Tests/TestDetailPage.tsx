import React, { useState } from 'react';
import { useGetTest } from '@/hooks';
import { Button, Checkbox, Form, Input, Radio, Select, Typography } from 'antd';
import axios from 'axios';

/*interface Question {
  _id: string;
  controlType: string;
  question: string;
  options: string[];
  answer: string[];
  description?: string;
}*/

interface UserTestAnswers {
  userId: string;
  answers: {
    questionId: string;
    givenAnswer: string[];
  }[];
}


export const TestDetailPage = () => {
  const { testData, isLoading } = useGetTest();
  const [form] = Form.useForm();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<Record<string, string[]>>({});


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const questions = testData?.questions || [];
  console.log('questions', questions)
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    form.validateFields().then((values) => {
      setAllAnswers((prev) => ({
        ...prev,
        ...values.answers, // Сохраняем текущий ответ
      }));
      setCurrentIndex((prev) => prev + 1);
      form.resetFields(); // Очищаем форму для следующего вопроса
    });
  };


  const handleSubmit = async () => {
    const finalAnswers = { ...allAnswers, ...form.getFieldsValue().answers };
    console.log("Финальные ответы перед отправкой:", finalAnswers);

    const payload: UserTestAnswers = {
      userId: '677fffee99e361c4c0db38ee',
      answers: Object.entries(finalAnswers).map(([questionId, givenAnswer]) => ({
        questionId,
        givenAnswer: Array.isArray(givenAnswer) ? givenAnswer : [givenAnswer],
      })),
    };

    console.log("Отправляемый payload:", payload);

    await axios.post(`api/tests/${testData._id}/answer`, payload);
  };


  const question = questions[currentIndex];
  console.log('question', question)

  return (
    <>
      <Typography.Title level={1}>{testData?.name}</Typography.Title>
      <Form form={form} onFinish={handleSubmit}>
        <Typography.Title level={4}>{question?.question}</Typography.Title>

        {question?.controlType === 'checkbox' && (
          <Form.Item key={question._id} name={['answers', question._id]} valuePropName="checked">
            <Checkbox.Group>
              {question.options.map((option) => (
                <Checkbox key={option} value={option}>
                  {option}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        )}

        {question?.controlType === 'select' && (
          <Form.Item  name={['answers', question._id]}>
            <Select options={question.options.map((item) => ({ label: item, value: item }))} />
          </Form.Item>
        )}

        {question?.controlType === 'input' && (
          <Form.Item name={['answers', question._id]}>
            <Input />
          </Form.Item>
        )}

        {question?.controlType === 'radio' && (
          <Form.Item name={['answers', question._id]}>
            <Radio.Group>
              {question.options.map((option) => (
                <Radio key={option} value={option}>{option}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}

        <div style={{ marginTop: 20 }}>
          {currentIndex > 0 && (
            <Button onClick={() => setCurrentIndex((prev) => prev - 1)}>Назад</Button>
          )}
          {isLastQuestion ? (
            <Button type="primary" onClick={() => form.submit()} style={{ marginLeft: 10 }}>
              Отправить
            </Button>
          ) : (
            <Button type="primary" onClick={handleNext} style={{ marginLeft: 10 }}>
              Далее
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};
