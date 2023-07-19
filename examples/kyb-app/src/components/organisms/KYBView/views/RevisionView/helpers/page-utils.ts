import { WorkflowDocumentPage } from '@app/domains/workflows/types';

export const createPageFieldName = ({ index }: WorkflowDocumentPage & { index: number }): string =>
  `page:${index}`;

export const parsePageIndex = (pageName: string): number | null => {
  if (!pageName) return null;

  return Number(pageName.split(':').at(-1)) || null;
};
