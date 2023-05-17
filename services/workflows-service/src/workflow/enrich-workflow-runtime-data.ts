import { WorkflowRuntimeData } from '@prisma/client';
import { DefaultContextSchema } from './schemas/context';

type Document = NonNullable<Unpacked<DefaultContextSchema['documents']>>;

const getDocumentId = (document: Document) => {
  const id = `${document?.category}-${document?.type}-${document?.issuer?.country}`;
  return id;
};

export const enrichWorkflowRuntimeData = (workflowRuntimeData: WorkflowRuntimeData) => {
  if (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflowRuntimeData?.context?.documents &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflowRuntimeData?.context?.documents.length > 0
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const documents = workflowRuntimeData?.context?.documents as DefaultContextSchema['documents'];
    const result = documents.map(document => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const id = getDocumentId(document);
      // get properties schema by document id // TODO ....
      const propertiesSchema = certificateOfResidenceGH.propertiesSchema;

      return { ...document, propertiesSchema };
    });

    return {
      ...workflowRuntimeData,
      documents: result,
    };
  }
};
