import React from 'react';
import { Table, Tag } from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

// Типы для ответов пользователя
interface UserAnswer {
  questionId: string;
  givenAnswer: string[];
  isCorrect: boolean;
}

// Типы для вопросов в результатах теста
interface ResultQuestion {
  questionId: string;
  questionText: string;
  givenAnswer: string[];
  isCorrect: boolean;
}

// Типы для данных теста
interface TestResult {
  answerId: string;
  testId: string;
  testName: string;
  totalQuestions: number;
  questions: ResultQuestion[];
  createdAt: string;
  timeTaken: number;
  correctPercentage: string;  // Добавляем поле для процента правильных ответов
}

// Пропсы компонента
interface TestResultsTableProps {
  data: TestResult[];
}

export const TestResultsTable: React.FC<TestResultsTableProps> = ({ data }) => {
  // Сортируем данные по времени (по возрастанию даты)
  const sortedData = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const mainColumns = [
    {
      title: 'Название теста',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Всего вопросов',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),  // Отображение даты
    },
    {
      title: 'Время выполнения',
      dataIndex: 'timeTaken',
      key: 'timeTaken',
      render: (timeTaken: number) => `${timeTaken} секунд`,  // Отображение времени
    },
    {
      title: 'Процент правильных ответов',
      dataIndex: 'correctPercentage',
      key: 'correctPercentage',
      render: (text: string) => `${text}%`,  // Отображение процента правильных ответов
    },
  ];

  const questionColumns = [
    {
      title: 'Вопрос',
      dataIndex: 'questionText',
      key: 'questionText',
    },
    {
      title: 'Данные ответы',
      dataIndex: 'givenAnswer',
      key: 'givenAnswer',
      render: (answers: string[]) => answers.join(', '),
    },
    {
      title: 'Статус',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      render: (isCorrect: boolean) => (
        <Tag color={isCorrect ? 'green' : 'red'}>
          {isCorrect ? 'Правильно' : 'Неправильно'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={mainColumns}
      dataSource={sortedData}  // Используем отсортированные данные
      rowKey="answerId"
      expandable={{
        expandedRowRender: (record: TestResult) => (
          <Table
            columns={questionColumns}
            dataSource={record.questions}
            rowKey="questionId"
            pagination={false}
            size="small"
          />
        ),
        expandIcon: ({ expanded, onExpand, record }: {
          expanded: boolean;
          onExpand: (record: TestResult, e: React.MouseEvent) => void;
          record: TestResult
        }) =>
          expanded ? (
            <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
          ) : (
            <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
          ),
        rowExpandable: (record: TestResult) =>
          record.questions && record.questions.length > 0,
      }}
    />
  );
};
