import { FC, useEffect } from 'react';
import { useGetTestsResults } from '@/hooks/useGetTestsResults/useGetTestsResults';
import { TestResultsTable } from '@/routes/Tests/TestsResults/components/TestsResultsTable';

export const TestsResultsPage: FC = () => {
  const { fetchTestsResults, data } = useGetTestsResults();
  useEffect(() => {
    fetchTestsResults();
    console.log(data.map(i => i._id))
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {data && (
        <>
          <h2>Результаты тестов</h2>
          <TestResultsTable data={data} />
        </>
      )}
    </div>
  );
};
