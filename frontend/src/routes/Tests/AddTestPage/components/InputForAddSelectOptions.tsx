import React, { FC, useState } from 'react';
import { Button, Input, SelectProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/select';

interface InputForAddSelectOptionsProps {
  setOptions: React.Dispatch<React.SetStateAction<DefaultOptionType[]>>;
  options: SelectProps['options'];
}

export const InputForAddSelectOptions: FC<InputForAddSelectOptionsProps> = ({
  setOptions,
  options,
}) => {
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
