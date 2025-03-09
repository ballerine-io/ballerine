import { DocumentDecision, DocumentStatus } from '@prisma/client';

import { Type } from '@sinclair/typebox';

export const CollectionFlowDocumentSchema = Type.Object({
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
  projectId: Type.String(),
});
