import { WorkflowRuntimeData } from '@prisma/client';
import { DefaultContextSchema } from './schemas/context';
import { getDocumentId } from '@/documents/utils';
import { getDocumentsByCountry } from '@/documents/schemas';
import { Document } from '@/documents/types';

export const enrichWorkflowRuntimeData = (workflowRuntimeData: WorkflowRuntimeData) => {
  if (workflowRuntimeData?.context?.documents?.length) {
    const documents = workflowRuntimeData?.context?.documents as DefaultContextSchema['documents'];
    const result = documents.map(document => {
      const documents = getDocumentsByCountry(document.issuer.country);
      const id = getDocumentId(document as unknown as Document);
      const documentSchema = documents[id];

      return {
        ...document,
        propertiesSchema: documentSchema ? documentSchema.propertiesSchema : {},
      };
    });

    workflowRuntimeData.context.documents = result;
  }

  return workflowRuntimeData;
};
