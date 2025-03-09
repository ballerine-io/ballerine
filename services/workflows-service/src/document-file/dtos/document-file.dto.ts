import { Type } from '@sinclair/typebox';
import { DocumentFileType, DocumentFileVariant } from '@prisma/client';
import * as z from 'zod';

export const DocumentFileSchema = Type.Object({
  id: Type.String(),
  type: Type.Enum(DocumentFileType),
  variant: Type.Enum(DocumentFileVariant),
  page: Type.Integer(),
  documentId: Type.String(),
  fileId: Type.String(),
  projectId: Type.String(),
});

export const DocumentFileJsonSchema = z
  .string()
  .transform(value => JSON.parse(value))
  .pipe(
    z.object({
      type: z.nativeEnum(DocumentFileType),
      variant: z.nativeEnum(DocumentFileVariant),
      page: z.number().positive().int(),
    }),
  );

export const CreateDocumentFileSchema = Type.Omit(DocumentFileSchema, ['id']);

export const UpdateDocumentFileSchema = Type.Partial(
  Type.Omit(DocumentFileSchema, ['id', 'documentId', 'projectId']),
);

export const DocumentFileParamsSchema = Type.Object({
  id: Type.String(),
});
