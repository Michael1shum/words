import React, { FC, useState } from 'react';
import { Question } from '../../../types';
import { Form, Select, SelectProps } from 'antd';
import { InputForAddSelectOptions } from './InputForAddSelectOptions';

export const SelectWithAddOptions: FC<{ controlType: Question['controlType'] }> = ({
  controlType,
}) => {
  const [options, setOptions] = useState<SelectProps['options']>([]);

  return (
    <Select
      mode={controlType === 'checkbox' ? 'multiple' : undefined}
      placeholder={controlType === 'checkbox' ? 'Выберите несколько вариантов' : 'Выберите вариант'}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Form.Item noStyle>
            <InputForAddSelectOptions setOptions={setOptions} options={options} />
          </Form.Item>
        </>
      )}
      options={options}
    />
  );
};
