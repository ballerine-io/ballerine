import { TWorkflowById } from '@/domains/workflows/fetchers';

export const checkIsIndividual = (workflow: TWorkflowById) =>
  workflow?.context?.entity?.type === 'individual';
