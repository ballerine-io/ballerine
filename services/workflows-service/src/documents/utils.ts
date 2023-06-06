import { DefaultContextSchema } from '@/workflow/schemas/context';
import { Document } from './types';

export const getDocumentId = (
  document: Document | DefaultContextSchema['documents'][number],
): string => {
  let id = `${document?.category}-${document?.type}-${document?.issuer?.country}`;

  if (document.version) {
    id = `${id}-v${document.version}`;
  }

  return id.toLowerCase();
};
