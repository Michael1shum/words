import React from 'react';
import { Link } from 'react-router-dom'; // Для создания ссылок
import { Button } from 'antd';

export const LabsPage = () => {
  const labs = [
    { _id: '1', name: 'Лабораторная работа 1' },
    { _id: '2', name: 'Лабораторная работа 2' },
    { _id: '3', name: 'Лабораторная работа 3' },
    // Добавь сюда другие лабораторные работы, если нужно
  ];

  return (
    <div>
      <h1>Список лабораторных работ</h1>
      <div>
        {labs.length > 0 ? (
          labs.map((lab) => (
            <div key={lab._id}>
              {/* Ссылка на страницу с лабораторной работой */}
              <Link to={`/labs/${lab._id}`}>{lab.name}</Link>
            </div>
          ))
        ) : (
          'Лабораторные работы не найдены'
        )}
      </div>
      <Button>Добавить лабораторную работу</Button> {/* Можно добавить кнопку для создания лабораторной */}
    </div>
  );
};
