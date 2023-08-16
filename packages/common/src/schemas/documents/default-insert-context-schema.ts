import { defaultContextSchema } from '@/schemas';

export const defaultInsertContextSchema = {
  ...defaultContextSchema,
  properties: {
    ...defaultContextSchema.properties,
    documents: {
      ...defaultContextSchema.properties.documents,
      items: {
        ...defaultContextSchema.properties.documents.items,
        required: defaultContextSchema.properties.documents.items.required.filter(
          key => key !== 'type',
        ),
      },
    },
  },
};
