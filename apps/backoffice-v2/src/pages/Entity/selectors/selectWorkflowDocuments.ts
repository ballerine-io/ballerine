import { TWorkflowById } from '@/domains/workflows/fetchers';

export const selectWorkflowDocuments = (workflow: TWorkflowById) => workflow?.context?.documents;
