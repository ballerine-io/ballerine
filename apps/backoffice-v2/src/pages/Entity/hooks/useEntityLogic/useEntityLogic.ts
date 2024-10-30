import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useParams } from 'react-router-dom';
import { useNotesByNoteable } from '@/pages/Entity/components/Notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';

export const useEntityLogic = () => {
  const { entityId } = useParams();
  const { data: notes } = useNotesByNoteable({ noteableId: entityId, noteableType: 'Workflow' });

  const { data: workflow } = useCurrentCaseQuery();
  const selectedEntity = workflow?.entity;

  return {
    selectedEntity,
    workflow,
    notes,
  };
};
