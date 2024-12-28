import { useState } from 'react';
import axios from 'axios';
import { Test } from '../../types';

interface UseGetTestsReturnValue {
  tests: Test[];
  isTestsLoading: boolean;
  fetchTests: () => Promise<void>;
}
export const useGetTests = (): UseGetTestsReturnValue => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isTestsLoading, setIsTestsLoading] = useState(false);

  const fetchTests = async () => {
    try {
      setIsTestsLoading(true);
      const response = await axios.get('/api/tests');
      if (response.status === 200 && response.data) {
        setTests(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestsLoading(false);
    }
  };

  return { tests, isTestsLoading, fetchTests };
};
