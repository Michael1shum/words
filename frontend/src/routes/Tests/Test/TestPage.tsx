import React from 'react';
import { useParams } from 'react-router-dom';

export const TestPage = () => {
  const { id } = useParams();
  console.log('id', id);
  return <h1>{id}</h1>;
};
