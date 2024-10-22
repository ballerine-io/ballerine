import { Static, Type } from '@sinclair/typebox';
import { defaultContextSchema } from './default-context-schema';

export const collectionFlowContextSchema = Type.Composite([
  defaultContextSchema,
  Type.Object({
    flowConfig: Type.Optional(
      Type.Object({
        // Workflow Service URL
        apiUrl: Type.String(),

        // Session Token
        tokenId: Type.String(),

        // Reflects current active state of UI
        appState: Type.String(),

        // Reflects current state of the process
        processState: Type.String(),

        // Name of the customer company
        customerCompany: Type.String(),

        // Reflects progress of the steps in the UI
        stepsProgress: Type.Optional(
          Type.Record(Type.String(), Type.Object({ isCompleted: Type.Boolean() })),
        ),
      }),
    ),
    state: Type.Optional(Type.String()),
    processState: Type.Optional(Type.String()),
    stepsProgress: Type.Optional(
      Type.Record(Type.String(), Type.Object({ isCompleted: Type.Boolean() })),
    ),
  }),
]);

export type CollectionFlowContextSchema = Static<typeof collectionFlowContextSchema>;
