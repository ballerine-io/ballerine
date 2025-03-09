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
      id: z.string(),
      category: z.string(),
      issuer: z.object({
        country: z.string(),
      }),
      issuingVersion: z.number(),
      version: z.string(),
      entityType: z.enum(['business', 'ubo', 'director']).default('business'),
      _document: z
        .object({
          id: z.string(),
        })
        .optional(),
    })
    .transform(
      ({ entityType, type, id, category, issuer, issuingVersion, version, _document }) => ({
        entityType,
        type,
        templateId: id,
        category,
        issuingCountry: issuer.country,
        issuingVersion: issuingVersion.toString(),
        version,
        ...(_document ? { _document } : {}),
      }),
    )
    .safeParse(template);

  if (!parsedDocument.success) {
    return;
  }

  return parsedDocument.data;
};
