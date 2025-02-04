import React, { FC, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  SelectProps,
  Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';
interface InputForAddSelectOptionsProps {
  setOptions: React.Dispatch<React.SetStateAction<DefaultOptionType[]>>;
  options: SelectProps['options'];
}

const InputForAddSelectOptions: FC<InputForAddSelectOptionsProps> = ({ setOptions, options }) => {
  const [optionValue, setOptionsValue] = useState('');
  return (
    <>
      <Input
        placeholder='Добавить вариант'
        value={optionValue}
        onChange={(e) => setOptionsValue(e.target.value.trim())}
      />
      <Button
        type={'text'}
        icon={<PlusOutlined />}
        onClick={() => {
          if (!options.some((item) => item.label === optionValue)) {
            setOptions((prev) => [...prev, { value: optionValue, label: optionValue }]);
            setOptionsValue('');
          }
        }}
      />
    </>
  );
};
export const AddTestPage = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<SelectProps['options']>([]);

  return (
    <>
      <Typography.Title level={1}>Добавление теста</Typography.Title>
      <Row>
        <Col span={12}>
          <Form
            layout={'vertical'}
            form={form}
            onFinish={(values) => console.log('values', values)}
          >
            <Col span={12}>
              <Form.Item name='name' label='Название теста'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='description' label='Описание теста'>
                <Input />
              </Form.Item>
            </Col>
            <Form.List
              name='questions'
              initialValue={[{ controlType: 'input', description: '', answer: '' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row key={field.key} gutter={[0, 12]}>
                      <Col span={24}>
                        <Row justify={'space-between'}>
                          <Typography.Text>{`Вопрос ${index + 1}`}</Typography.Text>
                          {fields.length > 1 ? (
                            <Button onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                          ) : null}
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Form.Item name={[field.name, 'question']} noStyle required={true}>
                          <Input placeholder='Вопрос' />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name={[field.name, 'description']} noStyle>
                          <Input placeholder='Описание вопроса' />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item name={[field.name, 'controlType']}>
                              <Select
                                placeholder='Тип вопроса'
                                options={[
                                  { value: 'checkbox', label: 'Множественный выбор' },
                                  { value: 'radio', label: 'Единичный выбор' },
                                  { value: 'input', label: 'Ввод значения' },
                                  { value: 'select', label: 'Выбор значения' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item shouldUpdate>
                              {({ getFieldValue }) => {
                                const controlType = getFieldValue([
                                  'questions',
                                  field.name,
                                  'controlType',
                                ]);
                                switch (controlType) {
                                  case 'input':
                                    return (
                                      <Form.Item name={[field.name, 'answer']} noStyle>
                                        <Input placeholder='Введите ответ' />
                                      </Form.Item>
                                    );
                                  default:
                                    return (
                                      <Form.Item name={[field.name, 'answer']} noStyle>
                                        <Select
                                          mode={controlType === 'checkbox' ? 'multiple' : undefined}
                                          placeholder={
                                            controlType === 'checkbox'
                                              ? 'Выберите несколько вариантов'
                                              : 'Выберите вариант'
                                          }
                                          dropdownRender={(menu) => (
                                            <>
                                              {menu}
                                              <Form.Item noStyle>
                                                <InputForAddSelectOptions
                                                  setOptions={setOptions}
                                                  options={options}
                                                />
                                              </Form.Item>
                                            </>
                                          )}
                                          options={options}
                                        />
                                      </Form.Item>
                                    );
                                }

                                return null;
                              }}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Col span={8}>
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => add({ controlType: 'input', question: '', answer: '' })}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />}
                      >
                        Добавить вопрос
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
            <Col span={4}>
              <Button type={'primary'} onClick={() => form.submit()}>
                Сохранить
              </Button>
            </Col>
          </Form>
        </Col>
      </Row>
    </>
  );
};
