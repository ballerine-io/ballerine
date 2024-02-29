import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  isObject,
  TDocument,
} from '@ballerine/common';
import { WorkflowDefinition } from '@prisma/client';

const composePropertiesSchema = (
  documentSchemaForDocument: ReturnType<typeof findDocumentSchemaForDocument>,
) => ({
  ...(documentSchemaForDocument?.propertiesSchema ?? {}),
  properties: Object.fromEntries(
    Object.entries(documentSchemaForDocument?.propertiesSchema?.properties ?? {}).map(
      ([key, value]) => {
        if (!isObject(value) || !Array.isArray(value.enum) || value.type !== 'string')
          return [key, value];

        return [
          key,
          {
            ...value,
            dropdownOptions: value.enum.map(item => ({
              value: item,
              label: item,
            })),
          },
        ];
      },
    ),
  ),
});

const getPropertiesSchemaForDocument = (document: DefaultContextSchema['documents'][number]) => {
  const documentsByCountry = getDocumentsByCountry(document?.issuer?.country);
  const documentSchemaForDocument = findDocumentSchemaForDocument(documentsByCountry, document);

  return composePropertiesSchema(documentSchemaForDocument);
};

export const addPropertiesSchemaToDocument = (
  document: DefaultContextSchema['documents'][number],
  documentSchema: WorkflowDefinition['documentsSchema'],
) => {
  // when does not have document specific for specific country/category -> go to default
  const propertiesSchemaFromDefinition =
    documentSchema &&
    getPropertiesFromDefinition(document, documentSchema as TDocument[], document?.issuer?.country);
  const propertiesSchema =
    propertiesSchemaFromDefinition || getPropertiesSchemaForDocument(document);

  return {
    ...document,
    propertiesSchema,
  };
};

const getPropertiesFromDefinition = (
  document: DefaultContextSchema['documents'][number],
  documentsSchema: TDocument[],
  countryCode: string,
): ReturnType<typeof getPropertiesSchemaForDocument> | undefined => {
  const localizedDocumentSchemas = documentsSchema.filter(
    documentSchema => documentSchema.issuer.country === countryCode,
  );

  if (localizedDocumentSchemas.length === 0) {
    console.info(`No localized document schemas found for ${countryCode}`);

    return;
  }

  const documentSchemaForDocument = findDocumentSchemaForDocument(
    localizedDocumentSchemas,
    document,
  );

  if (!documentSchemaForDocument) {
    console.info(`No document schema in definition found for document ${JSON.stringify(document)}`);

    return;
  }

  return composePropertiesSchema(documentSchemaForDocument);
};

const findDocumentSchemaForDocument = (
  documentsByCountry: TDocument[],
  document: DefaultContextSchema['documents'][number],
) => {
  const documentId = getDocumentId(document, false);

  return documentsByCountry?.find(doc => getDocumentId(doc, false) === documentId);
};
