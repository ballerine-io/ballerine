import { Type } from '@sinclair/typebox';
import { CollectionFlowDocumentSchema } from './create-collection-flow-document.schema';

export const UpdateCollectionFlowDocumentSchema = Type.Composite([
  CollectionFlowDocumentSchema,
  Type.Object({
    documentId: Type.String(),
    decisionReason: Type.Optional(Type.String()),
  }),
]);
