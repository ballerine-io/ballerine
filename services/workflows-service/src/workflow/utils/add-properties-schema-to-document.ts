import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  isObject,
  TDocument,
} from '@ballerine/common';
import { WorkflowDefinition } from '@prisma/client';

export const addPropertiesSchemaToDocument = (
  document: DefaultContextSchema['documents'][number],
  documentSchema: WorkflowDefinition['documentsSchema'],
) => {
  // if does not have document specific for specific country/category -> go to default
  const propertiesSchema =
    (documentSchema &&
      getPropertiesFromDefinition(
        document,
        documentSchema as TDocument[],
        document?.issuer?.country,
      )) ||
    getPropertiesSchemaForDocument(document);

  return {
    ...document,
    propertiesSchema,
  };
};
function getPropertiesSchemaForDocument(document: DefaultContextSchema['documents'][number]) {
  const documentsByCountry = getDocumentsByCountry(document?.issuer?.country);
  const documentSchemaForDocument = findDocumentSchemaForDocument(documentsByCountry, document);
  const propertiesSchema = composePropertiesSchema(documentSchemaForDocument);

  return propertiesSchema;
}

const getPropertiesFromDefinition = (
  document: DefaultContextSchema['documents'][number],
  documentsSchema: TDocument[],
  countryCode: string,
): ReturnType<typeof getPropertiesSchemaForDocument> | undefined => {
  const localizedDocumentSchemas = documentsSchema.filter(
    documentSchema => documentSchema.countryCode === countryCode,
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
  return documentsByCountry?.find(
    doc => getDocumentId(doc, false) === getDocumentId(document, false),
  );
};

function composePropertiesSchema(
  documentSchemaForDocument: ReturnType<typeof findDocumentSchemaForDocument>,
) {
  return {
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
  };
}
