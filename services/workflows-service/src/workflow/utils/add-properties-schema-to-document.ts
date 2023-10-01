import {
  DefaultContextSchema,
  getDocumentId,
  getDocumentsByCountry,
  isObject,
} from '@ballerine/common';

export const addPropertiesSchemaToDocument = (
  document: DefaultContextSchema['documents'][number],
) => {
  const propertiesSchema = getPropertiesSchemaForDocument(document);

  return {
    ...document,
    propertiesSchema,
  };
};
function getPropertiesSchemaForDocument(document: DefaultContextSchema['documents'][number]) {
  const documentsByCountry = getDocumentsByCountry(document?.issuer?.country);
  const documentByCountry = documentsByCountry?.find(
    doc => getDocumentId(doc, false) === getDocumentId(document, false),
  );

  const propertiesSchema = {
    ...(documentByCountry?.propertiesSchema ?? {}),
    properties: Object.fromEntries(
      Object.entries(documentByCountry?.propertiesSchema?.properties ?? {}).map(([key, value]) => {
        if (!(key in document.properties)) return [key, value];
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
      }),
    ),
  };

  return propertiesSchema;
}
