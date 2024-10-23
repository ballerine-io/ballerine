import { Static, Type } from '@sinclair/typebox';
import { defaultContextSchema } from './default-context-schema';

export enum CollectionFlowStateEnum {
  pending = 'pending',
  inprogress = 'inprogress',
  approved = 'approved',
  rejected = 'rejected',
  failed = 'failed',
  revision = 'revision',
}

export const collectionFlowContextSchema = Type.Composite([
  defaultContextSchema,
  Type.Object({
    collectionFlow: Type.Optional(
      Type.Object({
        config: Type.Optional(
          Type.Object({
            apiUrl: Type.String(),
            tokenId: Type.String(),
          }),
        ),
        state: Type.Optional(
          Type.Object({
            uiState: Type.String(),
            collectionFlowState: Type.Enum(CollectionFlowStateEnum),
            progress: Type.Optional(
              Type.Record(Type.String(), Type.Object({ isCompleted: Type.Boolean() })),
            ),
          }),
        ),
        additionalInformation: Type.Optional(
          Type.Object({
            customerCompany: Type.Optional(Type.String()),
          }),
        ),
      }),
    ),
  }),
]);

export type CollectionFlowContextSchema = Static<typeof collectionFlowContextSchema>;
