import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Test } from '../../routes/types';

interface useGetTestReturnValue {
  testData?: Test;
  isLoading: boolean;
}

export const useGetTest = (): useGetTestReturnValue => {
  const [data, setData] = useState<Test | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams(); // Получаем ID теста из URL

  const fetchTest = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tests/${id}`); // Получаем тест по ID

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching test:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchTest(id);
    }
  }, []);

  return {
    testData: data,
    isLoading,
  };
};
