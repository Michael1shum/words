import { useState } from 'react';
import axios from 'axios';

export const useGetTestsResults = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestsResults = async () => {
    try {
      const response = await axios.get(`/api/tests/results`);
      console.log('response', response);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Ошибка при получении результатов тестов:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    data,
    isLoading,
    fetchTestsResults,
  };
};
