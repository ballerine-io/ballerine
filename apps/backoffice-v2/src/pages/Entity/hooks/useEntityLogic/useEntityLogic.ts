import { useParams } from 'react-router-dom';

import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';

export const useEntityLogic = () => {
  const [{ isNotesOpen }] = useSerializedSearchParams();
  const { entityId } = useParams();
  const { data: notes } = useNotesByNoteable({ noteableId: entityId, noteableType: 'Workflow' });

  const { data: workflow } = useCurrentCaseQuery();
  const selectedEntity = workflow?.entity;

  return {
    selectedEntity,
    workflow,
    isNotesOpen: isNotesOpen === 'true',
    notes,
  };
};
