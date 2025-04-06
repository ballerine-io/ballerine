import { Static, Type } from '@sinclair/typebox';

const SubscriptionSchema = Type.Object({
  type: Type.String(),
  url: Type.String({ format: 'uri', pattern: '^https://' }),
  events: Type.Array(Type.String()),
});

const CallbackResultSchema = Type.Object({
  transformers: Type.Array(Type.Any()),
  action: Type.Optional(Type.String()),
  deliverEvent: Type.Optional(Type.String()),
  persistenceStates: Type.Optional(Type.Array(Type.String())),
});

const ChildCallbackResultSchema = Type.Object({
  definitionId: Type.String(),
  transformers: Type.Array(Type.Any()),
  action: Type.Optional(Type.String()),
  deliverEvent: Type.Optional(Type.String()),
});

const MainRepresentativeSchema = Type.Object({
  fullName: Type.String(),
  email: Type.String(),
});

const AvailableDocumentSchema = Type.Object({
  category: Type.String(),
  type: Type.String(),
});

const language = Type.Optional(Type.String());
const initialEvent = Type.Optional(Type.String());
const subscriptions = Type.Optional(Type.Array(SubscriptionSchema));
const uiOptions = Type.Optional(
  Type.Object({
    redirectUrls: Type.Optional(
      Type.Object({
        success: Type.String({ format: 'uri' }),
        failure: Type.String({ format: 'uri' }),
      }),
    ),
  }),
);

export const WorkflowRuntimeConfigSchema = Type.Object({
  language,
  initialEvent,
  subscriptions,
  uiOptions,
});

export type TWorkflowRuntimeConfig = Static<typeof WorkflowRuntimeConfigSchema>;

export const WorkflowConfigSchema = Type.Object({
  language,
  initialEvent,
  subscriptions,
  isAssociatedCompanyKybEnabled: Type.Optional(Type.Boolean()),
  isCaseOverviewEnabled: Type.Optional(Type.Boolean()),
  isDocumentTrackerEnabled: Type.Optional(Type.Boolean()),
  isCaseRiskOverviewEnabled: Type.Optional(Type.Boolean()),
  isLegacyReject: Type.Optional(Type.Boolean()),
  isLockedDocumentCategoryAndType: Type.Optional(Type.Boolean()),
  isManualCreation: Type.Optional(Type.Boolean()),
  isDemo: Type.Optional(Type.Boolean()),
  isExample: Type.Optional(Type.Boolean()),
  supportedLanguages: Type.Optional(Type.Array(Type.String())),
  completedWhenTasksResolved: Type.Optional(Type.Boolean()),
  workflowLevelResolution: Type.Optional(Type.Boolean()),
  allowMultipleActiveWorkflows: Type.Optional(Type.Boolean()),
  availableDocuments: Type.Optional(Type.Array(AvailableDocumentSchema)),
  callbackResult: Type.Optional(CallbackResultSchema),
  childCallbackResults: Type.Optional(Type.Array(ChildCallbackResultSchema)),
  createCollectionFlowToken: Type.Optional(Type.Boolean()),
  mainRepresentative: Type.Optional(MainRepresentativeSchema),
  customerName: Type.Optional(Type.String()),
  enableManualCreation: Type.Optional(Type.Boolean()),
  kybOnExitAction: Type.Optional(
    Type.Union([Type.Literal('send-event'), Type.Literal('redirect-to-customer-portal')]),
  ),
  reportConfig: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  hasUboOngoingMonitoring: Type.Optional(Type.Boolean()),
  maxBusinessReports: Type.Optional(Type.Number()),
  isMerchantMonitoringEnabled: Type.Optional(Type.Boolean()),
  isOngoingMonitoringEnabled: Type.Optional(Type.Boolean()),
  isCollectionFlowPageRevisionEnabled: Type.Optional(Type.Boolean()),
});

export type TWorkflowConfig = Static<typeof WorkflowConfigSchema>;
