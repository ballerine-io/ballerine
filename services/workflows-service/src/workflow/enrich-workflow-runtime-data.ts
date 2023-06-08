import { WorkflowRuntimeData } from '@prisma/client';
import { countryCodes } from '@/common/countries';
import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  TDocument,
} from '@ballerine/common';

export const enrichWorkflowRuntimeData = (workflowRuntimeData: WorkflowRuntimeData) => {
  if (workflowRuntimeData?.context?.documents?.length) {
    const documents = workflowRuntimeData?.context?.documents as DefaultContextSchema['documents'];
    // @ts-ignore
    const result = documents.map(document => {
      const documents = getDocumentsByCountry(
        document.issuer.country as (typeof countryCodes)[number],
      );
      const id = getDocumentId(document as unknown as TDocument);
      const documentSchema = documents[id];
      document.id ||= id;

      return {
        ...document,
        propertiesSchema: documentSchema ? documentSchema.propertiesSchema : {},
      };
    });

    workflowRuntimeData.context.documents = result;
  }

  return workflowRuntimeData;
};
