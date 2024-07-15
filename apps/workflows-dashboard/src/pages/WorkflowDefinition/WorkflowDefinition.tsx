import { useParams } from 'react-router-dom';

export const WorkflowDefinition = () => {
  const id = useParams<{ id: string }>().id;

  return <div>workflow definition {id}</div>;
};
