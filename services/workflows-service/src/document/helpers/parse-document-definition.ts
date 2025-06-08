import { IDocumentTemplate, IFormElement } from '@/common/ui-definition-parse-utils/types';
import z from 'zod';

export const parseDocumentDefinition = (element: IFormElement<{ template: IDocumentTemplate }>) => {
  const template = element.params?.template;

  if (!template) {
    return;
  }

  const parsedDocument = z
    .object({
      type: z.string(),
      category: z.string(),
      issuer: z.object({
        country: z.string(),
      }),
      issuingVersion: z.number(),
      version: z.string(),
      entityType: z.enum(['business', 'ubo', 'director']).default('business'),
    })
    .transform(({ entityType, type, category, issuer, issuingVersion, version }) => ({
      entityType,
      type,
      category,
      issuingCountry: issuer.country,
      issuingVersion: issuingVersion.toString(),
      version,
    }))
    .safeParse(template);

  if (!parsedDocument.success) {
    return;
  }

  return parsedDocument.data;
};
