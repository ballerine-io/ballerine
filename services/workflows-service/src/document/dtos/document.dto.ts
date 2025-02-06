import { Type } from '@sinclair/typebox';
import { DocumentStatus, DocumentDecision } from '@prisma/client';

export const DocumentSchema = Type.Object({
  id: Type.String(),
  category: Type.String(),
  type: Type.String(),
  issuingVersion: Type.String(),
  issuingCountry: Type.String(),
  version: Type.Integer(),
  status: Type.Enum(DocumentStatus),
  decision: Type.Optional(Type.Enum(DocumentDecision)),
  properties: Type.Record(Type.String(), Type.Any()),
  businessId: Type.Optional(Type.String()),
  endUserId: Type.Optional(Type.String()),
  workflowRuntimeDataId: Type.Optional(Type.String()),
  projectId: Type.String(),
});

export const CreateDocumentSchema = Type.Omit(DocumentSchema, ['id', 'projectId']);

export const UpdateDocumentSchema = Type.Partial(DocumentSchema);

export const DeleteDocumentsSchema = Type.Object({
  ids: Type.Array(Type.String()),
});
