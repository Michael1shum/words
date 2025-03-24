import React, { useState, useEffect } from 'react';
import { useGetTest } from '@/hooks';
import { Button, Checkbox, Form, Input, Radio, Select, Typography, Modal, Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UserTestAnswers } from '@/routes/types';

export const TestDetailPage = () => {
  const { testData, isLoading } = useGetTest();
  const [form] = Form.useForm();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<Record<string, string[]>>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(testData?.timeLimit * 60 || 0);  // Время в секундах
  const [isTestFinished, setIsTestFinished] = useState(false);

  // Таймер
  useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);  // Очистка интервала при размонтировании
    }

    if (timeLeft <= 0 && !isTestFinished) {
      setIsTestFinished(true);
      handleSubmit();  // Отправка данных, когда тест завершен
    }
  }, [timeLeft, isTestStarted, isTestFinished]);

  const handleStartTest = () => {
    setIsTestStarted(true);
  };

  const handleSubmit = async () => {
    if (!testData?._id) {
      console.error("Test data is not available");
      return;  // Ранний выход, если данные теста не доступны
    }

    const finalAnswers = { ...allAnswers, ...form.getFieldsValue().answers };
    const timeTaken = testData?.timeLimit * 60 - timeLeft;  // Расчет времени, потраченного на тест

    const payload: UserTestAnswers = {
      userId: '677fffee99e361c4c0db38ee',
      answers: Object.entries(finalAnswers).map(([questionId, givenAnswer]) => ({
        questionId,
        givenAnswer: Array.isArray(givenAnswer) ? givenAnswer : [givenAnswer],
      })),
    };

    // Отправка данных на сервер
    await axios.post(`api/tests/${testData._id}/answer`, { timeTaken, payload });
    alert('Тест завершён');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!testData) {
    return <div>Test data is not available</div>;
  }

  const questions = testData?.questions || [];
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

  const question = questions[currentIndex];

  return (
    <>
      {!isTestStarted && (
        <Modal
          title="Начало теста"
          open={!isTestStarted}  // Используем open вместо visible
          footer={null}
          onCancel={() => setIsTestStarted(true)} // Закрытие модалки и запуск теста
        >
          <Typography.Title level={4}>{testData?.name}</Typography.Title>
          <p>{testData?.description}</p>
          <p>Время на тест: {testData?.timeLimit} минут</p>
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            onClick={handleStartTest}
          >
            Начать тест
          </Button>
        </Modal>
      )}

      <Typography.Title level={1}>{testData?.name}</Typography.Title>

      {/* Таймер */}
      <div>
        {isTestStarted && !isTestFinished && (
          <Progress
            percent={(timeLeft / (testData?.timeLimit * 60)) * 100}
            size="small"
            status="active"
            strokeColor="green"
          />
        )}
        <p>{`Оставшееся время: ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`}</p>
      </div>

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
          <Form.Item name={['answers', question._id]}>
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
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}

        <div style={{ marginTop: 20 }}>
          {currentIndex > 0 && (
            <Button onClick={() => setCurrentIndex((prev) => prev - 1)}>Назад</Button>
          )}
          {isLastQuestion ? (
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
              Завершить
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
