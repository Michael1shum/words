import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export const LabsPage = () => {
  const labs = [
    { _id: '3', name: 'Лабораторная работа' },
  ];

  return (
    <div>
      <h1>Список лабораторных работ</h1>
      <div>
        {labs.length > 0 ? (
          labs.map((lab) => (
            <div key={lab._id}>
              <Link to={`/labs/${lab._id}`}>{lab.name}</Link>
            </div>
          ))
        ) : (
          'Лабораторные работы не найдены'
        )}
      </div>
      {/*<Button>Добавить лабораторную работу</Button>*/}
    </div>
  );
};
