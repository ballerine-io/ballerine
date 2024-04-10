import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';

export const useEntityLogic = () => {
  const { data: workflow } = useCurrentCase();
  const selectedEntity = workflow?.entity;

  return {
    selectedEntity,
    workflow,
  };
};
