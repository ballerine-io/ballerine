import { WorkflowRuntimeData } from '@prisma/client';
import { DefaultContextSchema } from './schemas/context';
import { certificateOfResidenceGH } from '../schemas/documents/GH';
import { Unpacked } from '@/types';

type Document = NonNullable<Unpacked<DefaultContextSchema['documents']>>;

export const getDocumentId = (document: Document) => {
  const id = `${document?.category}-${document?.type}-${document?.issuer?.country}`;
  return id;
};

export const enrichWorkflowRuntimeData = (workflowRuntimeData: WorkflowRuntimeData) => {
  if (workflowRuntimeData?.context?.documents?.length) {
    const documents = workflowRuntimeData?.context?.documents as DefaultContextSchema['documents'];
    const result = documents.map(document => {
      const id = getDocumentId(document);
      // get properties schema by document id // TODO ....
      const propertiesSchema = certificateOfResidenceGH.propertiesSchema;

      return { ...document, propertiesSchema };
    });

    workflowRuntimeData.context.documents = result;
  }

  return workflowRuntimeData;
};
