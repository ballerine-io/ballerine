import { DocumentDecision, DocumentStatus } from '@prisma/client';
import { Type } from '@sinclair/typebox';

export const DocumentSchema = Type.Object({
  id: Type.String(),
  category: Type.String(),
  type: Type.String(),
  issuingVersion: Type.String(),
  issuingCountry: Type.String(),
  version: Type.Integer(),
  status: Type.Enum(DocumentStatus),
  decision: Type.Optional(Type.Enum(DocumentDecision)),
  decisionReason: Type.Optional(Type.String()),
  comment: Type.Optional(Type.String()),
  properties: Type.Record(Type.String(), Type.Any()),
  businessId: Type.Optional(Type.String()),
  endUserId: Type.Optional(Type.String()),
  workflowRuntimeDataId: Type.Optional(Type.String()),
  projectId: Type.String(),
});

export const CreateDocumentSchema = Type.Omit(DocumentSchema, ['id', 'projectId']);

export const UpdateDocumentSchema = Type.Partial(
  Type.Omit(DocumentSchema, [
    'id',
    'projectId',
    'workflowRuntimeDataId',
    'businessId',
    'endUserId',
  ]),
);

export const UpdateDocumentDecisionSchema = Type.Composite([
  Type.Pick(DocumentSchema, ['decisionReason', 'comment']),
  Type.Object({
    decision: Type.Union([
      Type.Literal('approve'),
      Type.Literal('reject'),
      Type.Literal('revision'),
      Type.Null(),
    ]),
  }),
]);

export const DeleteDocumentsSchema = Type.Object({
  ids: Type.Array(Type.String()),
});
