/** @format */

import { ListForm } from '@components/ListForm';
import { WordList } from '@components/WordsList/WordsList';
import { Col, FormProps, Row } from 'antd';
import Typography from 'antd/es/typography/Typography';
import React, { useState } from 'react';
import { WordsFields } from './types';

export const App = () => {
  const [data, setData] = useState<WordsFields[]>([]);
  console.log(data);

  const onFinish: FormProps['onFinish'] = (values) => {
    setData(values.data);
  };
  return (
    <>
      <Row justify={'center'}>
        <Col span={24}>
          <ListForm onFinish={onFinish} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <WordList data={data} />
        </Col>
      </Row>
    </>
  );
};
