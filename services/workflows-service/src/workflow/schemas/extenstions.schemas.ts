import { Type, Static } from '@sinclair/typebox';

const TransformSchema = Type.Object({
  mapping: Type.Union([
    Type.String(),
    Type.Array(
      Type.Object({
        method: Type.String(),
        source: Type.String(),
        target: Type.String(),
      }),
    ),
  ]),
  transformer: Type.String(),
});

const ApiPluginSchema = Type.Object({
  url: Type.String(),
  name: Type.String(),
  method: Type.String(),
  headers: Type.Object({
    'Content-Type': Type.Optional(Type.String()),
    Authorization: Type.String(),
  }),
  request: Type.Object({
    transform: Type.Array(TransformSchema),
  }),
  response: Type.Object({
    transform: Type.Array(TransformSchema),
  }),
  pluginKind: Type.String(),
  stateNames: Type.Array(Type.String()),
  errorAction: Type.String(),
  successAction: Type.String(),
  displayName: Type.Optional(Type.String()),
  persistResponseDestination: Type.Optional(Type.String()),
});

const CommonPluginSchema = Type.Object({
  name: Type.String(),
  pluginKind: Type.String(),
  stateNames: Type.Array(Type.String()),
  rulesSource: Type.Optional(
    Type.Object({
      source: Type.String(),
      databaseId: Type.String(),
    }),
  ),
  iterateOn: Type.Optional(
    Type.Array(
      Type.Object({
        mapping: Type.String(),
        transformer: Type.String(),
      }),
    ),
  ),
  errorAction: Type.Optional(Type.String()),
  successAction: Type.Optional(Type.String()),
  actionPluginName: Type.Optional(Type.String()),
});

const ChildWorkflowPluginSchema = Type.Object({
  name: Type.String(),
  initEvent: Type.String(),
  pluginKind: Type.String(),
  definitionId: Type.String(),
  transformers: Type.Array(TransformSchema),
});

const DispatchEventPluginSchema = Type.Object({
  name: Type.String(),
  eventName: Type.String(),
  pluginKind: Type.String(),
  stateNames: Type.Array(Type.String()),
  errorAction: Type.String(),
  transformers: Type.Array(TransformSchema),
  successAction: Type.String(),
});

export const WorkflowExtensionSchema = Type.Object({
  apiPlugins: Type.Optional(Type.Array(ApiPluginSchema)),
  commonPlugins: Type.Optional(Type.Array(CommonPluginSchema)),
  childWorkflowPlugins: Type.Optional(Type.Array(ChildWorkflowPluginSchema)),
  dispatchEventPlugins: Type.Optional(Type.Array(DispatchEventPluginSchema)),
});

export type TWorkflowExtenstion = Static<typeof WorkflowExtensionSchema>;
