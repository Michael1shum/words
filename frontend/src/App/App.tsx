import React from 'react';
import { Button, Col, Row } from 'antd';

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
