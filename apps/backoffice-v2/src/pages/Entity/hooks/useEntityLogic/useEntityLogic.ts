import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';

export const useEntityLogic = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const selectedEntity = workflow?.entity;

  return {
    selectedEntity,
    workflow,
  };
};
