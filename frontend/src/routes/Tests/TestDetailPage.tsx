import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Test {
  _id: string;
  name: string;
  questions: Array<any>;
}

export const TestDetailPage = () => {
  const { id } = useParams();  // Получаем ID теста из URL
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${id}`);  // Получаем тест по ID
        if (!response.ok) {
          throw new Error('Failed to fetch test data');
        }
        const data = await response.json();
        setTest(data);
      } catch (error) {
        setError('Error fetching test');
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTest();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;  // Показываем загрузку
  }

  if (error) {
    return <div>{error}</div>;  // Показываем ошибку, если она произошла
  }

  if (!test || !test.questions) {
    return <div>No test data available</div>;  // Показываем, если данных нет
  }

  return (
    <div>
      <h1>{test.name}</h1>
      <div>
        {test.questions.length > 0 ? (
          test.questions.map((question, index) => (
            <div key={index}>
              <h3>{question.question}</h3>
              <p>{question.description}</p>
              <ul>
                {question.options.map((option: string, idx: number) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No questions available for this test</p>  // Если вопросов нет
        )}
      </div>
    </div>
  );
};
