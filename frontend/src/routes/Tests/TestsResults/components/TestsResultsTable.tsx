import React from 'react';
import { Table, Tag } from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

export const TestResultsTable = ({ data }) => {
  console.log('data в компоненте:', data);
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
      render: (answers) => answers.join(', '),
    },
    {
      title: 'Статус',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      render: (isCorrect) => (
        <Tag color={isCorrect ? 'green' : 'red'}>{isCorrect ? 'Правильно' : 'Неправильно'}</Tag>
      ),
    },
  ];

  return (
    <Table
      columns={mainColumns}
      dataSource={data}
      rowKey='testId'
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={questionColumns}
            dataSource={record.questions}
            rowKey='questionId'
            pagination={false}
            size='small'
          />
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
          ) : (
            <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
          ),
        rowExpandable: (record) => record.questions && record.questions.length > 0,
      }}
    />
  );
};
