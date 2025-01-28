import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAdditionalWorkflowContext = () => {
  const [searchParams] = useSearchParams();

  const context = useMemo(() => {
    return {
      query: {
        token: searchParams.get('token'),
      },
    };
  }, [searchParams]);

  return context;
};
