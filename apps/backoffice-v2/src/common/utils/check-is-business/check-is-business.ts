import { TWorkflowById } from '@/domains/workflows/fetchers';

export const checkIsBusiness = (workflow: TWorkflowById) =>
  workflow?.context?.entity?.type === 'business';
