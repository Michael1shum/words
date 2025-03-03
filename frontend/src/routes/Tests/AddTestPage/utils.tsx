import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  FormListFieldData,
  Input,
  Radio,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { Test } from '@/routes/types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

export const getCheckBoxOrRadioField = (
  form: FormInstance<any>,
  field: FormListFieldData,
  isRadio?: boolean
) => {
  return (
    <Form.List name={[field.name, 'options']}>
      {(optionsFields, { add: addOption, remove: removeOption }) => (
        <>
          <Row justify={'space-between'}>
            <Col span={12}>
              <Typography.Title level={5}>Варианты ответов</Typography.Title>
            </Col>
            <Col span={12}>
              <Button type='dashed' onClick={() => addOption('')} icon={<PlusOutlined />}>
                Добавить вариант ответа
              </Button>
            </Col>
          </Row>
          {optionsFields.map((optionField, optionIndex) => (
            <Row key={optionField.key} gutter={[0, 12]} style={{ marginTop: '12px' }}>
              <Col span={20}>
                <Row gutter={[0, 12]} align={'middle'}>
                  <Col span={2}>
                    {isRadio ? (
                      <Radio.Group
                        value={
                          form.getFieldValue(['questions', field.name, 'answers'])?.[0] || undefined
                        }
                        onChange={(e) => {
                          const { value } = e.target;
                          const updatedAnswers = [value];
                          form.setFieldsValue({
                            questions: form
                              .getFieldValue('questions')
                              .map((q: Test['questions'], i: number) =>
                                i === field.name ? { ...q, answers: updatedAnswers } : q
                              ),
                          });
                        }}
                      >
                        <Radio
                          value={form.getFieldValue([
                            'questions',
                            field.name,
                            'options',
                            optionIndex,
                          ])}
                        />
                      </Radio.Group>
                    ) : (
                      <Tooltip title={'Это верный ответ'} trigger={'hover'}>
                        <Checkbox
                          onChange={(e) => {
                            const { checked } = e.target;
                            const fieldPath = ['questions', field.name, 'answers'];
                            const currentAnswers: string[] = form.getFieldValue(fieldPath) || [];
                            const selectedOption = form.getFieldValue([
                              'questions',
                              field.name,
                              'options',
                              optionIndex,
                            ]);

                            const updatedAnswers = checked
                              ? [...currentAnswers, selectedOption]
                              : currentAnswers.filter((option) => option !== selectedOption);

                            form.setFieldsValue({
                              questions: form
                                .getFieldValue('questions')
                                .map((q: Test['questions'], i: number) =>
                                  i === field.name ? { ...q, answers: updatedAnswers } : q
                                ),
                            });
                          }}
                        />
                      </Tooltip>
                    )}
                  </Col>
                  <Col span={20}>
                    <Form.Item name={[optionField.name]} noStyle required={true}>
                      <Input placeholder={`Вариант ${optionIndex + 1}`} width={'100%'} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={1}>
                <Button
                  onClick={() => {
                    removeOption(optionField.name);

                    const currentAnswers = form.getFieldValue(['questions', field.name, 'answers']);
                    const selectedOption = form.getFieldValue([
                      'questions',
                      field.name,
                      'options',
                      optionIndex,
                    ]);
                    console.log('selectedOption', selectedOption, 'currentAnswers', currentAnswers);
                    if (currentAnswers?.includes(selectedOption)) {
                      const updatedAnswers = currentAnswers.filter(
                        (option: string) => option !== selectedOption
                      );

                      form.setFieldsValue({
                        questions: form
                          .getFieldValue('questions')
                          .map((q: Test['questions'], i: number) =>
                            i === field.name ? { ...q, answers: updatedAnswers } : q
                          ),
                      });
                    }
                  }}
                  icon={<DeleteOutlined />}
                  type={'text'}
                />
              </Col>
            </Row>
          ))}
        </>
      )}
    </Form.List>
  );
};
