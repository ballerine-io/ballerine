import {
  getDocumentsByCountry,
  getDocumentSchemaByCountry,
  TAvailableDocuments,
  TDocument,
} from '@ballerine/common';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getDocumentsSchemas = (
  issuerCountryCode: Parameters<typeof getDocumentSchemaByCountry>[0],
  workflow: TWorkflowById,
) => {
  if (!issuerCountryCode) return;

  const documentSchemaByCountry = getDocumentSchemaByCountry(
    issuerCountryCode,
    workflow.workflowDefinition?.documentsSchema as TDocument[],
  )
    .concat(getDocumentsByCountry(issuerCountryCode))
    .reduce((unique: TDocument[], item: TDocument) => {
      const isDuplicate = unique.some(u => u.type === item.type && u.category === item.category);
      if (!isDuplicate) {
        unique.push(item);
      }
      return unique;
    }, [] as TDocument[])
    .filter((documentSchema: TDocument) => {
      if (
        !workflow?.workflowDefinition?.config?.availableDocuments ||
        !Array.isArray(workflow?.workflowDefinition?.config?.availableDocuments)
      ) {
        return true;
      }

      return !!workflow?.workflowDefinition?.config?.availableDocuments.find(
        (availableDocument: TAvailableDocuments[number]) =>
          availableDocument.type === documentSchema.type &&
          availableDocument.category === documentSchema.category,
      );
    });

  if (!Array.isArray(documentSchemaByCountry) || !documentSchemaByCountry.length) {
    console.warn(
      `No document schema found for issuer country code of "${issuerCountryCode}" and documents schema of\n`,
      workflow.workflowDefinition?.documentsSchema,
    );
  }

  return documentSchemaByCountry;
};
