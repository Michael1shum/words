import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Question, useGetTest} from "../../hooks/useGetTest/useGetTest";
import {Button, Checkbox, Form, Input, Radio, Select, Typography} from "antd";

const getFormItem = (question:Question) => {
  switch (question.controlType) {
    case "checkbox":
      return
/*      <div>
        <Typography.Title level={4}>
        {question.description}
        </Typography.Title>
        <div>
          {question.options.map((option) => (<Form.Item key={option} name={[option]}> <Checkbox>{option}</Checkbox> </Form.Item>))}
        </div>
      </div>*/
    case "select":
      return <Select options={question.options.map((item) => {return {name:item, value:item}})}/>
    case "input":
      return <Input/>
    case "radio":
      return question.options.map((option) => (<Form.Item name={option}> <Radio/> </Form.Item>))
  }
}

export const TestDetailPage = () => {
  const {testData, isLoading} = useGetTest();
  const [form] = Form.useForm();
  console.log("testData", testData)

  if (isLoading) {
    return <div>Loading...</div>;  // Показываем загрузку
  }

  return (
    <div>
      <Typography.Title level={1}>{testData?.name}</Typography.Title>
      <Form form={form} onFinish={(values) => console.log(values)}>
        {testData?.questions.map((question) => getFormItem(question))}
        <Button type={"primary"} onClick={() => form.submit()}>Submit</Button>
      </Form>

    </div>
  );
};
