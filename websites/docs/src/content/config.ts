import { defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

// Define collections with descriptive names
const documentsCollection = defineCollection({ schema: docsSchema() });
const i18nDataCollection = defineCollection({ type: 'data', schema: i18nSchema() });

// Export collections
export const collections = {
  documents: documentsCollection,
  i18nData: i18nDataCollection,
};
