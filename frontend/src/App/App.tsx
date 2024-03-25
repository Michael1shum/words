/** @format */

import { Button, Col, Row } from 'antd';
import React from 'react';

export const App = () => {
  return (
    <>
      <Row justify={'center'}>
        <Col span={24}>
          <Button type={'primary'}>Запрос</Button>
        </Col>
      </Row>
    </>
  );
};
