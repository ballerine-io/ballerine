import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  isObject,
  TDocument,
} from '@ballerine/common';

export const addPropertiesSchemaToDocument = (
  document: DefaultContextSchema['documents'][number],
  documentSchema: WorkflowDefinition.documentSchema,
) => {
  const propertiesSchema = documentSchema
    ? getPropertiesFromDefinition(document, documentSchema, document?.issuer?.country)
    : getPropertiesSchemaForDocument(document);

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
): ReturnType<typeof getPropertiesSchemaForDocument> => {
  const localizedDocumentSchemas = documentsSchema.filter(
    documentSchema => documentSchema.countryCode === countryCode,
  );

  if (localizedDocumentSchemas.length === 0 && countryCode !== 'ZZ') {
    return getPropertiesFromDefinition(document, documentsSchema, 'ZZ');
  }

  if (localizedDocumentSchemas.length === 0) {
    throw new Error(`Document schema not found for document: ${JSON.stringify(document)}`);
  }

  const documentSchemaForDocument = findDocumentSchemaForDocument(
    localizedDocumentSchemas,
    document,
  );

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
