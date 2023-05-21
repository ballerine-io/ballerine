import { DefaultContextSchema } from '@/workflow/schemas/context';

export const getDocumentId = (document: DefaultContextSchema['documents'][number]) => {
  return `${document?.category}-${document?.type}-${document?.issuer?.country}`;
};
