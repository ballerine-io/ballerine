import { useParams } from 'react-router-dom';

export const useWorkflowId = () => {
  const { workflowId } = useParams();

  return workflowId;
};
