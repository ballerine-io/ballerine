import { TWorkflowById } from '@/domains/workflows/fetchers';
import { selectDirectors } from '@/pages/Entity/selectors/selectDirectors';

export const getDirectorsIdsFromWorkflow = (workflow: TWorkflowById) =>
  selectDirectors(workflow)
    .map(director => director.ballerineEntityId)
    .filter(Boolean);
