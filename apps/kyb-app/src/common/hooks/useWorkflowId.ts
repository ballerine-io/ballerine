import { useSearchParams } from 'react-router-dom';

export const useWorkflowId = () => {
  const [searchParams] = useSearchParams();

  return searchParams.get('workflowId');
};
