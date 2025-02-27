import React from 'react';
import { Button, Col, Form, Input, Row, Typography, Checkbox, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

export const AddTestPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: { name: string; description: string; questions: any[] }) => {
    const formattedValues = {
      name: values.name,
      description: values.description,
      questions: values.questions.map((question) => ({
        controlType: question.controlType,
        question: question.question,
        description: question.description,
        options: question.options,
        answer: question.answers,
      })),
    };

    console.log('Отправляемые данные:', formattedValues);

    axios.post('api/tests/add', formattedValues, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Ответ сервера:', response.data);
        alert('Тест успешно добавлен!');
      })
      .catch((error) => {
        console.error('Ошибка при отправке запроса:', error);
        alert('Произошла ошибка при добавлении теста. Проверьте консоль для подробностей.');
      });
  };

  return (
    <>
      <Typography.Title level={1}>Добавление теста</Typography.Title>
      <Row>
        <Col span={12}>
          <Form
            layout={'vertical'}
            form={form}
            onFinish={onFinish}
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
              initialValue={[{ controlType: 'input', question: '', description: '', options: [], answers: [] }]}
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
                          <Col span={24}>
                            <Form.List name={[field.name, 'options']}>
                              {(optionsFields, { add: addOption, remove: removeOption }) => (
                                <>
                                  {optionsFields.map((optionField, optionIndex) => (
                                    <Row key={optionField.key} gutter={[0, 12]}>
                                      <Col span={12}>
                                        <Form.Item
                                          name={[optionField.name]}
                                          noStyle
                                          required={true}
                                        >
                                          <Input placeholder={`Вариант ${optionIndex + 1}`} />
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                        {/* Чекбокс для добавления/удаления ответа в поле answers */}
                                        <Form.Item noStyle>
                                          <Checkbox
                                            onChange={(e) => {
                                              const { checked } = e.target;

                                              // Получаем текущий список ответов для данного вопроса
                                              const fieldPath = ['questions', field.name, 'answers'];
                                              const currentAnswers: string[] = form.getFieldValue(fieldPath) || [];

                                              // Получаем текущий вариант ответа
                                              const selectedOption = form.getFieldValue(['questions', field.name, 'options', optionIndex]);

                                              const updatedAnswers = checked
                                                ? [...currentAnswers, selectedOption] // Добавляем текст ответа
                                                : currentAnswers.filter((option: string) => option !== selectedOption); // Удаляем ответ

                                              // Обновляем форму с новыми ответами
                                              form.setFieldsValue({
                                                questions: form.getFieldValue('questions').map((q: any, i: number) =>
                                                  i === field.name ? { ...q, answers: updatedAnswers } : q
                                                ),
                                              });

                                              console.log(`Обновленные ответы для вопроса ${field.name}:`, updatedAnswers);
                                            }}
                                          />


                                        </Form.Item>
                                      </Col>
                                      <Col span={24}>
                                        <Button onClick={() => removeOption(optionField.name)}>
                                          Удалить вариант
                                        </Button>
                                      </Col>
                                    </Row>
                                  ))}
                                  <Col span={24}>
                                    <Button
                                      type="dashed"
                                      onClick={() => addOption('')}
                                      style={{ width: '60%' }}
                                      icon={<PlusOutlined />}
                                    >
                                      Добавить вариант
                                    </Button>
                                  </Col>
                                </>
                              )}
                            </Form.List>


                          </Col>
                        </Row>
                      </Col>

 {/*                     <Col span={24}>
                        <Form.Item name={[field.name, 'answers']} label="Выберите ответы">
                          <Checkbox.Group
                            options={(field as any).options?.map((option: string, idx: number) => ({
                              label: option,
                              value: `option-${field.name}-${idx}`,
                            }))}
                            onChange={(checkedValues) => {
                              // Обновляем ответы с выбранными вариантами
                              form.setFieldsValue({
                                [`questions[${index}].answers`]: checkedValues,
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>*/}
                    </Row>
                  ))}
                  <Col span={8}>
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => add({ controlType: 'input', question: '', description: '', options: [], answers: [] })}
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
